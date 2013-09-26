@echo off
setlocal ENABLEDELAYEDEXPANSION
for %%i in (*.user.js) do (
	set filename=%%~i
	set basename=!filename:.user.js=!
	rem echo Filename:%filename%
	rem echo Basename:%basename%
	rem echo %basename%
	echo updating !filename! [..\!basename!\!filename!]
	copy "..\!basename!\!filename!" "!filename!"
)
endlocal