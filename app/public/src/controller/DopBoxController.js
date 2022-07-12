class DropBoxController{

    constructor (){

        // Recupera o Elemento do botão de Upload
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        // Recupera o Elemento Input
        this.inputFilesEl = document.querySelector('#files');
        // Recupera o Elemento Modal da Barra de Upload
        this.snackModalEl = document.querySelector('#react-snackbar-root');

        // Chama a função de Inicialização dos Eventos
        this.initEvents();        

    }

    // Método Inicializador dos Eventos
    initEvents(){
        
        // Adiciona a Escuta de Eventos no botão send files
        this.btnSendFileEl.addEventListener('click', event => {

            // Quando ocorrer o evento click no botão de Uploads, o inputFile será chamado por este evento click
            this.inputFilesEl.click();

        });

        // Adiciona a Escuta de Eventos no Input, e no change "Mudança", ou seja, quando forem selecionados arquivos, pega o evento
        this.inputFilesEl.addEventListener('change', event => {

            this.uploadTask(event.target.files);

            // Quando ocorrer o evento, a mudança, adiciona o CSS, para exibir o modal via CSS
            this.snackModalEl.style.display = 'block'

        });
    }

    // Método para Upload de Arquivos
    // Cria um array vazio para guardar os Files, e cada arquivo terá uma promessa com o promises
    uploadTask(files){
        
        // Array vazio para receber os arquivos
        let promises = [];

       /*  Como não sabemos a quantidade, faremos um loop por todos os arquiovos, que é uma Coleção,
        E depois fazemos o unpack dos arquivos no array com o Operado spread ... */
        [...files].forEach(file => {

            // Para cada arquivo adicionado no array, faremos uma promise
            promises.push(new Promise((resolve, reject) => {

                /* Realizando a requisição AJAX para cada Promessa
                Criando a Variavel ajax */
                let ajax = new XMLHttpRequest();

                // Abrindo a requisição via POST, e mandando para a pasta /upload
                ajax.open('POST', '/upload');

                // Verificaremos se a Requisição ajax foi feita com onload
                ajax.onload = event => {                    
                    // Após pegar o evento onload
                    // Testamos, para ver se a resposta do ajax é aceita
                    try {                        
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);                        
                    }
                };

                // Se ocorrer erro na requisição ajax, ja pegamos esse evento e passamos para o reject da promise
                ajax.onerror = event => {
                    reject(event);
                };

                // Usaremos o FormData para passar os arquivos para o Ajax
                let formData = new FormData();

                // pegamos os arquivos que estão passando pelo forEach com a variavel file
                formData.append('input-file', file);

                ajax.send(formData);

            }));

        });        

        // Adicionando o array ao promise all, caso todas promessas passarem retorna, se falhar rejeita
        return Promise.all(promises);

    }
}