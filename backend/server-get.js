'use strict'

const { readFile } = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)

const READ_OPTIONS = { encoding: 'utf-8' }
const INDEX_URL = 'c:/Users/FX706/Desktop/GreenCard/frontend/index.html'
module.exports = async () => {

    //Recuperer le contenu du fichier html index.html
    const contenu = await readFileAsync(INDEX_URL, READ_OPTIONS)

    //Retourner la page HTML
    return contenu
    /*readFile('c:/xx' , {encoding:'utf-8'},(err,contenu) => {

    })*/
} 