import { PROJECT_DIRECTION } from '../..'
import { Request, Response } from 'express'
import { SingleSong } from '../../models/SingleSong'
import path from 'path'
import fs from 'fs'


type reqBodyData = {
    username: string,
    name: string,
    author: string,
    lycics: string,
    duration: number,
}

export function uploadNewSong(req: Request<{}, {}, reqBodyData>, res: Response) {
    const { file } = req
    const { username, name, author, duration, lycics } = req.body
    if (!file) {
        return res.status(403).send({ error: 'file is required' })
    }

    if (!username) {
        return res.status(403).send({ error: 'cant publush file as anonimous' })
    }


    const allowedExt = RegExp(/^.*\.(mp3|ogg)$/)
    const isFileExtensionAllowed = allowedExt.test(file.originalname)

    if (!isFileExtensionAllowed) {
        return res.status(403).send({ error: 'wrong file extension' })
    }

    const pathToSong = path.join('../../files/music')

    fs.writeFile(pathToSong, file.path, (error) => {
        if (error) {
            throw error
        }
    })

    const modelToSave = new SingleSong({
        name: name,
        path: pathToSong,
        originalFileName: file.originalname,
        duration: duration,
        lycics: lycics ? lycics : '',
        author: author
    })

    modelToSave.save()

    return res.status(200).send({ message: 'ok' })
}