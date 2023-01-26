$filePath = "Address: C:\Users\leopa\Desktop\Me\YTMusic\downloads\imgs{ENTER}"
$fileName = "test"
ControlClick("Open", "", "ToolbarWindow323","",1,"Right")
ControlSend("Open","","Edit2",$filePath)
;~ Send("{ENTER}")
ControlClick("Open","","Edit1")
ControlFocus("Open","","Edit1")
ControlSetText("Open","","Edit1", $fileName)
;~ ControlClick("Open","","Button1")