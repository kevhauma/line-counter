## Line Counter

this little script counts the line of certain file types.


## usage:


`node app.js -ext js,css,html -ignore node_modules,.git`

-ext: the extentions you want to count the lines of
default: js,css,html,cs,py

-ignore: folders you want to ignore (does not support spaces in folders...yet)
default: node_modules,.git