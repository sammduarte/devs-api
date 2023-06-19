const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json())

const devs = []

const GITHUB_URL = "https://api.github.com/users"

async function getUserFromGithub(username) {
    try {
        const { data } = await axios.get(`${GITHUB_URL}/${username}`)

        return data
    } catch (error) {
        console.log(error.response.data);
    }
}

app.post('/devs', async (req, res) => {
    const { username } = req.body;

    const devAlreadyExists = devs.some(dev => dev.username === username)

    if (devAlreadyExists) {
        return res.status(400).json({ message: "Já existe um Dev com esse username!" })
    }

    const user = await getUserFromGithub(username)

    if (!user) { //se o usuário não existir, essa condição abaixo será satisfeita;
        return res.status(400).json({ message: "Usuário não encontrado no Github!" })
    }

    const dev = { //objeto do usuário que está sendo cadastrado
        id: user.id,
        name: user.name,
        username
    }

    devs.push(dev)

    return res.status(201).json({ //status 201 = algo foi criado com sucesso
        message: "Dev criado com sucesso!",
        dev,
    });
})

app.get('/devs', (req, res) => {
    return res.json(devs)
})

app.listen(3333)
