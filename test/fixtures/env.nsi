!ifndef NULL_DEVICE
    !error "OutFile not defined"
!endif

!echo "UUID:${NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE}"

OutFile ${NULL_DEVICE}
Unicode true

Section
  Nop
SectionEnd
