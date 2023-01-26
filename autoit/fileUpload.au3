$filePath = "C:\Users\leopa\Desktop\Me\YTMusic\downloads\imgs"
$fileName = "test"
WinWait("","",5)
ControlFocus("Open", "", "ToolbarWindow323")
ControlSetText("Open","", "Edit2", $filePath)
ControlFocus("Open","","Edit1")
ControlSetText("Open","","Edit1", $fileName)
ControlClick("Open","","Button1")