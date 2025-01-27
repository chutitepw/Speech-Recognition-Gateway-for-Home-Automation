import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(22,GPIO.OUT)
#print "LED Blue: Off"
GPIO.output(22,GPIO.LOW)
