import { AvailableLanguages } from "@/hooks/useLocalization"

export interface IProjectItem {
    title: string,
    description: string,
}

export type ILocalizedProjectItem = Record<keyof typeof AvailableLanguages, IProjectItem> & {
    image: string,
    hyperlink?: string,
    languages?: string,
    _NAME: string,
    _TYPE: "private" | "public",
}

export const myProjects: ILocalizedProjectItem[] = [{
    _NAME: "website-project",
    _TYPE: "public",
    'en-us': {
        title: "raf-os.github.io",
        description:    "It's this website right here!\n\n" +
                        "It uses the *Next.JS* framework to export a static, fully front-end website to be hosted as a github page. " +
                        "It's written mostly in typescript, with some HTML and CSS for the layout and styling. " +
                        "The source code is fully available on my github profile, or you can also click the button at the end of " +
                        "this description to be taken to the repository automatically.\n\n" +
                        "The moving background you see uses *Babylon.js* to render a real-time procedurally generated 3D scene. " +
                        "Initially, the idea was to have a cityscape as the background, with buildings passing through. " +
                        "While it worked, a single simple building 3D model I made in blender, while very small in file size (~50kb), " +
                        "dramatically increased the initial page load time, which was unacceptable. I then chose to not load " +
                        "any models at all, but to procedurally generate some terrain through the use of a GLSL shader. " +
                        "The shader works by both displacing a flat surface vertically, thus adding the mountain heights, and drawing " +
                        "the colorful square grid texture. The sun itself is also drawn using a separate shader, leaving the sky as " +
                        "the only thing that's actually an image texture, that I rendered using blender.",
    },
    'pt-br': {
        title: "raf-os.github.io",
        description:    "É esse website!\n\n" +
                        "Ele utiliza o framework *Next.js* para exportar um site estático, totalmente no front-end para ser hosteado " +
                        "como uma página do github. Foi programado quase totalmente em typescript, com um pouco de HTML e CSS para o layout " +
                        "e estilos. O código fonte está disponível em sua totalidade no meu perfil do github, ou pode também clicar no botão no " +
                        "final dessa descrição para ir diretamente ao repositório.\n\n" +
                        "O fundo animado que você vê utiliza *Babylon.js* para apresentar uma cena em 3D gerada proceduralmente. " +
                        "Inicialmente, a ideia era ter uma cidade como o fundo, com os prédios passando ao longo do tempo. " +
                        "Apesar de ter funcionado, um único simples modelo de prédio que fiz em blender, apesar de ser muito pequeno de tamanho (+- 50kb), " +
                        "aumentou dramaticamente o tempo inicial de carregamento da página, que foi inaceitável. Decidi então que ao invés de utilizar " +
                        "modelos, iria gerar proceduralmente um terreno pelo uso de um shader GLSL personalizado. Ele pega uma superfície plana " +
                        "e acrescenta altura, criando as montanhas, e então desenha a textura por cima dessa superfície. O sol também é desenhado " +
                        "através de um próprio shader, e somente o céu no fundo que é uma imagem que criei usando o blender.",
    },
    image: "website.webp",
    hyperlink: "https://github.com/raf-os/raf-os.github.io",
    languages: "Typescript, HTML, CSS, GLSL"
}, {
    _NAME: "test-vite-project",
    _TYPE: "public",
    'en-us': {
        title: "Test Playground",
        description:    "A collection of various front-end experiments written in typescript. " +
                        "It uses Vite and react-router as its base.\n\n" +
                        "Right now, it contains: an attempt at making a better web form system that " +
                        "returns a JSON object when the form is submitted; and a few prototypes of an " +
                        "app that would theoretically allow the user to create an app by merely dragging and dropping elements. " +
                        "The latter is meant to be a more accessible alternative to coding, targetting less experienced " +
                        "users, providing more ease of use at the expense of complexity (for better or worse).",
    },
    'pt-br': {
        title: "Test Playground",
        description:    "Uma coleção de vários experimentos em front-end programados em typescript. " +
                        "Utiliza Vite e react-router como sua base.\n\n" +
                        "Atualmente, contém: uma tentariva de criar um sistema de formulários melhor que retorna um " +
                        "objeto JSON quando o formulário é enviado; e alguns protótipos de um app que teoreticamente permitiria " +
                        "que o usuário programasse um app somente arrastando elementos pré-definidos. Este teve a intenção de " +
                        "ser uma alternativa mais acessível para programação, sendo que o alvo são usuários menos experientes, " +
                        "providenciando facilidade de uso ao custo de complexidade (para melhor ou pior).",
    },
    image: "playground.webp",
    hyperlink: "https://github.com/raf-os/my-vite-learn-app",
    languages: "Typescript, HTML, CSS"
}, {
    _NAME: "godot-fps",
    _TYPE: "public",
    'en-us': {
        title: "Godot C# FPS",
        description:    "A simple first person shooter game prototype using the godot game engine, written entirely in C#. " +
                        "The 3D models were downloaded from sketchfab, which I then had to rig and animate in blender. " +
                        "Right now, these assets are not included in the github repository, as they're a bit larger in size " +
                        "and not ideal for a repo, and while the models were free downloads, I'm not sure under what license they're under, " +
                        "so I don't know how freely I may distribute them, and if there are any additional prerequisites such as crediting " +
                        "the authors. I will probably get this sorted out later.",
    },
    'pt-br': {
        title: "Godot C# FPS",
        description:    "Um simples protótipo de jogo de tiro de primeira pessoa usando o godot, programado totalmente em C#. " +
                        "Os modelos 3D foram baixados do sketchfab, e posteriormente fiz o rigging e animei no blender. " +
                        "Nesse momento, esses modelos não estão disponíveis no repositório, por serem um pouco grandes e não serem " +
                        "ideais para um repositório no github, e apesar dos modelos serem gratuitos, não tenho certeza de qual licença " +
                        "os autores definiram, então não sei se posso livremente distribuí-los, e se preciso de algum outro pré-requisito " +
                        "como adicionar crédito aos autores. Provavelmente irei lidar com isso no futuro.",
    },
    image: "godot-fps.webp",
    hyperlink: "https://github.com/raf-os/godot-csharp-fps",
    languages: "C#"
}, {
    _NAME: "nutria-dynamic",
    _TYPE: "private",
    'en-us': {
        title: "NutrIA Dynamic Website",
        description:    "A commercial project I started with my brother that leverages a large language model on a separate back end " +
                        "to generate custom nutritional reports to clients, which this website would then arrange the data " +
                        "in a more user-friendly way, with the idea of creating more modular and personalized reports, to better " +
                        "help them achieve their nutritional goals.\n\n" +
                        "While this project is mostly aligned with front-end development, it still has some light back-end work " +
                        "that directly fetches data from a mongodb database.\n\n" +
                        "*As of now, the project is in an indefinite hiatus.*",
    },
    'pt-br': {
        title: "NutrIA Site Dinâmico",
        description:    "Um projeto comercial que começei com meu irmão, que faz uso de um Large Language Model em um back-end separado " +
                        "para gerar relatórios nutricionais personalizados aos clientes, que então seriam re-organizados por esse website " +
                        "em um formato mais agradável ao usuário, para melhor ajudá-los a alcançar suas metas nutricionais.\n\n" +
                        "Apesar do projeto em grande parte ser direcionado ao front-end, ainda tem leves elementos de back-end " +
                        "que busca informações diretamente de um banco de dados do mongodb.\n\n" + 
                        "*Atualmente, o projeto está em pausa por tempo indefinido.*"
    },
    image: "nutria-dynamic.webp",
    languages: "Typescript, HTML, CSS"
}, {
    _NAME: "nutria-rest-api",
    _TYPE: "private",
    'en-us': {
        title: "NutrIA REST API",
        description:    "A commercial project I started with my brother. This is the back-end portion of the project, " +
                        "and uses the FastAPI python library to set up an API endpoint that communicates with the Whatsapp and OpenAI APIs." +
                        "My contributions were mostly at the beggining, helping set up and organize the original project. " +
                        "After that was done, I moved on to the more UI oriented areas, on the front end.",
    },
    'pt-br': {
        title: "REST API do NutrIA",
        description:    "Um projeto comercial que iniciei com meu irmão. Essa é a parte do back-end do projeto, e utiliza a biblioteca " +
                        "FastAPI do python para criar um endpoint de uma API que comunica com os APIs do Whatsapp e OpenAI. " +
                        "Minhas contribuições foram em grande parte no início, ajudando a montar e organizar o projeto inicial. " +
                        "Depois disso, me foquei mais nas partes de UI, no front-end."
    },
    image: "nutria-rest-api.webp",
    languages: "Python"
}, {
    _NAME: "nutria-dashboard",
    _TYPE: "private",
    'en-us': {
        title: "AI Agent Dashboard",
        description:    "A dashboard made to help configuring and monitoring the activity of AI chatbot agents in an easy, " +
                        "centralized and human readable way, as to lower the barrier of entry for both their deployment and " +
                        "their maintenance. This one inspired some of the experiments on my personal project up above, 'Test Playground'.\n\n" +
                        "This project has an equal amount of front and back-end work, and contains some basic user authentication.\n\n" +
                        "*As of now, the project is in an indefinite hiatus.*",
    },
    'pt-br': {
        title: "Dashboard do NutrIA",
        description:    "Um dashboard feito para ajudar a configurar e monitorar as atividades de agentes de chat IA de uma forma mais fácil, " +
                        "centralizada e de fácil leitura humana, com intuito de diminuir a barreira de entrada para criação e manutenção dos " +
                        "mesmos. Esse projeto inspirou alguns de meus experimentos mostrados acima, no 'Test Playground'.\n\n" +
                        "Esse projeto tem uma quantidade igual de front-end e back-end, e contém um simples sistema de autenticação " +
                        "de usuários. \n\n" +
                        "*Atualmente, o projeto está em pausa por tempo indefinido.*"
    },
    image: "nutria-dashboard.webp",
    languages: "Typescript, HTML, CSS"
}];
export const projectsWithID = myProjects.map((p, idx) => ({...p, __ID: idx}));