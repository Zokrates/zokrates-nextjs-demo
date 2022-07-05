#!/bin/bash

zokrates compile -i ./magic_square.zok -o magic_square --verbose
zokrates setup -i magic_square -b ark -s g16