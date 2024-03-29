let fs = require("fs")

let {ext,ignore} = getOptions(process.argv.join(" "))
let folder = process.argv[2]

ext = ext || "js,css,html,cs,py"
ignore = ignore || "node_modules,.git"

let extRegEx = new RegExp(`(\\.${ext.split(",").map(x=>x.trim()).join("|\\.")})$`)
let ignoreRegEx = new RegExp(`(${ignore.split(",").map(x=>x.trim()).join("|")})$`)

if (!folder) {
    throw "please give a folder"
}
let largestFile = {count: 0}
let distinct = {}
readDir(folder).then(total => {
    console.log("\n\ntotal lines written: ", total)
    console.log(distinct)
    console.log("largestFile: ", largestFile)
}).catch(e => console.log(e))

function readDir(f) {
    return new Promise((res, rej) => {
        try {
            let localTotal = 0
            fs.readdir(f, async(err, files) => {
                if (err) rej(err)
                for (let file of files) {
                    let fullpath = `${f}\\${file}`
                    if (fs.lstatSync(fullpath).isDirectory()) {       
                        
                        if(!fullpath.match(ignoreRegEx))
                            localTotal += await readDir(fullpath)
                    }
                    else {
                        let lines = await readFile(fullpath)
                        if (lines > largestFile.count)
                            largestFile = {
                                count: lines,
                                file: fullpath.replace(folder, "")
                            }
                        localTotal += lines
                    }
                }
                if(localTotal > 0)
                console.log(localTotal.toString().padStart(10), f.replace(folder, "") ? f.replace(folder, "") : "\\")
                res(localTotal)
            })
        } catch (e) {
            rej(e)
        }
    })
}

function readFile(f) {
    return new Promise((res, rej) => {
        if (f.match(extRegEx)) {
            fs.readFile(f, 'utf8', (err, text) => {
                let lines = text.split("\n").length
                let fileParts = f.split(".")
                let ext = fileParts[fileParts.length - 1]
                if (!distinct[ext]) distinct[ext] = 0
                distinct[ext] += lines
                if (err) rej(err)
                res(lines)
            })
        }
        else res(0)
    })
}

function getOptions(string){
    let optionStringArray = string.split("-")
    optionStringArray.shift()
    
    ob = {}
    optionStringArray.forEach(s=>{
        let parts = s.split(" ")
        let name = parts.shift()
        ob[name] = parts.join(" ")
    })
    return ob
}
