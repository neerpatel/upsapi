/**
 *  
 *  UPSMon - UPS Monitoring Driver
 *
 *  Copyright 2024 Neer Patel (modified from the original version)
 *  Copyright 2016 Steve White (https://github.com/shackrat/Hubitat/blob/master/UPS%20Monitor/UPSMonitor.groovy)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 *
 *
 */
b

import groovy.json.JsonSlurper
metadata
{
    definition (
        name: "UPS Mon - UPS Monitoring Driver", 
        namespace: "neerpatel", 
        author: "Neer Patel",
        importUrl:"https://raw.githubusercontent.com/neerpatel/upsapi/main/Hubitat/UPSMonitor.groovy",
        singleThreaded: false
    )
    {
        capability "Battery"
		capability "Voltage Measurement"
		capability "Power Source"
		capability "Power Meter"
        capability "Initialize"
		capability "Refresh"

		
		attribute "loadPercent", "string"
        attribute "upsname", "string"
        attribute "model", "string"
		attribute "serial", "string"
		attribute "upsStatus", "string"
		attribute "batteryVoltage", "string"
		attribute "loadPercent", "string"
		attribute "timeOnBattery", "string"
		attribute "lifetimeOnBattery", "string"
		attribute "lowTransVolts", "string"
		attribute "highTransVolts", "string"
		attribute "nomPower", "string"
		attribute "sensitivity", "string"
		attribute "lastUpdate", "string"
		attribute "batteryDate", "string"
		attribute "lastPowerFail", "string"
		attribute "lastPowerRestore", "string"
		attribute "lastPowerFailReason", "string"
		attribute "batteryRuntime", "string"
        attribute "msg", "string"
        
		command "refresh"
	}

	preferences
	{	
		section("Device")
		{
			input("ip", "string", title:"IP Address", description: "IP Address of the Raspberry Pi", defaultValue: "192.168.X.X" ,required: true, displayDuringSetup: true)	
            input("port", "number", title:"Port Number", defaultValue: 8070, range: 1..65535, required: true)
		}
		section
		{
			input "enableDebug", "bool", title: "Enable debug logging?", description: "Show detailed responses to commands?", defaultValue: false, required: false, multiple: false
		}
	}
}


def installed()
{
	log.info "UPSMon - Installed"
	initialize()
}


def updated()
{
	log.info "UPSMon -  UPS Updated"
	initialize()
	refresh()
}


def initialize()
{
    unschedule()
	log.info "UPSMon - Initialized."

	if (enableDebug)
	{
		log.info "Verbose logging has been enabled for the next 30 minutes."
		runIn(1800, logsOff)
	}
}


def reset()
{
    if (enableDebug) log.debug "reset called"
	initialize()
}


def refresh()
{
    
    def host =  ip + ":" + port
    log.info "refresh: ${host}"
	// Initiate local LAN request

	def hubAction = new hubitat.device.HubAction(
			method: "GET",
			path: "/ups/apcaccess",
			headers: [
				HOST: host,
					"Content-Type":"application/json",
					Accept: "*/*",
				],
			body: query
		)
    
    
    if (enableDebug) log.debug "Requesting update from APC service on ${host}/ups/apcaccess"
    
    sendHubCommand(hubAction)
    
}


def parse(String description)
{
    if (enableDebug) log.debug "parse called"
	def msg = parseLanMessage(description)
	if (enableDebug) log.debug "PARSED LAN EVENT: " + msg
	
	// Update DNI if changed
	if (msg?.mac && msg.mac != device.deviceNetworkId)
	{
		if (enableDebug) log.debug "Updating DNI to MAC ${msg.mac}..."
		device.deviceNetworkId = msg.mac
	}

	// Response to a push notification
	if (msg?.headers?.Referer == "apcupsd" && msg?.body)
    {
    	if (enableDebug) log.trace "Processing LAN event notification..."
    	def body = msg?.body
		def sluper = new JsonSlurper();
		def json = sluper.parseText(body)
        if (enableDebug) log.debug "json : " + json
		// Response to an event notification

        if (json?.event && (json?.event != "" || json?.event != "cron"))
		{
			log.info "Push notification for UPS event [${json?.event}] detected."
			
			// Update the child device if it's monitored
			updatePowerStatus(json.event)
		}
		// Response to a getUPSstatus call
		else if (json)
		{
			if (enableDebug) log.debug "Device update received."
			updateDeviceStatus(json)
		}
		else log.error "ABORTING DUE TO UNKNOWN EVENT"
	}
}


def updatePowerStatus(status)
{
	def powerSource =
		status == "mainsback" ? "mains" : 
			status == "powerout" ? "battery" : 
				status == "onbattery" ? "battery" : 
					status == "offbattery" ? "mains" : 
						"mains"

	sendEvent(name: "powerSource", value: powerSource, displayed: this.currentPowerSource != powerSource ? true : false)
    
    if (powerSource == "mains") sendEvent(name: "sessionStatus", value: "stopped", displayed: this.currentSessionStatus != sessionStatus ? true : false)
    else if (powerSource == "battery") sendEvent(name: "sessionStatus", value: "running", displayed: this.currentSessionStatus != sessionStatus ? true : false)

    sendEvent(name: "msg", value: data.msg, displayed: this.currentmsg != status ? true : false)
}


def updateDeviceStatus(data)
{
    log.info "UPS ${data.upsname} pushed an update"
    if (enableDebug) log.debug data
	def power = 0
	def timeLeft = Math.round(Float.parseFloat(data.timeleft.replace(" Minutes", "")))
	def battery = Math.round(Float.parseFloat(data.bcharge.replace(" Percent", "")))
	def voltage = Float.parseFloat(data.linev.replace(" Volts", ""))
	def batteryVoltage = Float.parseFloat(data.battv.replace(" Volts", ""))
	def lowTransVolts = Float.parseFloat(data.lotrans.replace(" Volts", ""))
	def highTransVolts = Float.parseFloat(data.hitrans.replace(" Volts", ""))
	def loadPercent = Float.parseFloat(data.loadpct.replace(" Percent", ""))
    def nomPower = Float.parseFloat(data.nompower.replace(" Watts", ""))
	def powerSource =
    	data.status == "ONLINE" ? "mains" : 
        	data.status == "ONBATT" ? "battery" : 
            	"mains"

	// Calculate wattage as a percentage of nominal load
    power = ((loadPercent / 100) * nomPower)
    
	sendEvent(name: "powerSource", value: powerSource, displayed: this.currentPowerSource != powerSource ? true : false)
	sendEvent(name: "timeRemaining", value: timeLeft, displayed: false)  
	sendEvent(name: "upsStatus", value: data.status.toLowerCase(), displayed: this.currentUpsStatus != data.status ? true : false)
    sendEvent(name: "upsname", value: data.upsname, displayed: this.currentUpsname != data.upsname ? true : false)
	sendEvent(name: "model", value: data.model, displayed: this.currentModel != data.model ? true : false)
	sendEvent(name: "serial", value: data.serialno, displayed: this.currentSerial != data.serialno ? true : false)
	sendEvent(name: "battery", value: battery, displayed: true)
	sendEvent(name: "batteryRuntime", value: data.timeleft, displayed: this.currentRunTimeRemain != data.timeleft ? true : false)
	sendEvent(name: "batteryVoltage", value: batteryVoltage, displayed: this.currentBatteryVoltage != batteryVoltage ? true : false)
	sendEvent(name: "voltage", value: voltage, descriptionText: "Line voltage is ${voltage} volts.", displayed: this.currentVoltage != voltage ? true : false)
	sendEvent(name: "loadPercent", value: loadPercent, displayed: this.currentLoadPercent != loadPercent ? true : false)
	sendEvent(name: "timeOnBattery", value: data.tonbatt, displayed: this.currentTimeOnBattery != data.tonbatt ? true : false)
	sendEvent(name: "lifetimeOnBattery", value: data.cumonbatt, displayed: this.currentLifetimeOnBattery != data.cumonbatt ? true : false)
	sendEvent(name: "lowTransVolts", value: lowTransVolts, displayed: this.currentLowTransVolts != lowTransVolts ? true : false)
	sendEvent(name: "highTransVolts", value: highTransVolts, displayed: this.currentHighTransVolts != highTransVolts ? true : false)
	sendEvent(name: "sensitivity", value: data.sense, displayed: this.currentSensitivity != data.sense ? true : false)
	sendEvent(name: "batteryDate", value: data.battdate, displayed: this.currentBatteryDate != data.battdate ? true : false)
	sendEvent(name: "lastUpdate", value: data.date, displayed: false)
	sendEvent(name: "nomPower", value: nomPower, displayed: this.currentNomPower != nomPower ? true : false)
	sendEvent(name: "power", value: power, displayed: this.currentPower != power ? true : false)
	sendEvent(name: "lastPowerFail", value: data.xonbatt, displayed: this.currentNomPower != data.xonbatt ? true : false)
	sendEvent(name: "lastPowerRestore", value: data.xoffbatt, displayed: this.currentPower != data.xoffbatt ? true : false)
	sendEvent(name: "lastPowerFailReason", value: data.lastxfer, displayed: this.currentLastPowerFailReason != data.lastxfer ? true : false)
    sendEvent(name: "msg", value: data.msg, displayed: true)
}


/*
	logsOff
    
	Disables debug logging.
*/
def logsOff()
{
    log.warn "debug logging disabled..."
	device.updateSetting("enableDebug", [value:"false",type:"bool"])
}