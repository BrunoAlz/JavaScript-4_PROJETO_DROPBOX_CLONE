class DropBoxController{

    constructor (){

        // Recupera o Elemento do botão de Upload
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        // Recupera o Elemento Input
        this.inputFilesEl = document.querySelector('#files');
        // Recupera o Elemento Modal da Barra de Upload
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        // Recupera o Elemento Barra de Upload para tornar o carregamento da barra dinamico
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        // Recupera o Elemento label que exibe o nome do documento que está sendo feito upload
        this.nameFileEl = this.snackModalEl.querySelector('.filename');
        // Recupera o Elemento labe que exibe o tempo restante para o Upload do arquivo
        this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');

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

            // Quando ocorrer o evento, "a mudança" chama o método modalSHow
            this.modalShow();

            // Limpando o Elemento Input, após o evento change
            this.inputFilesEl.value = '';

        });
    }

    // Método para mostrar e esconder o modal durante os Uploads
    modalShow(show = true){
        // se a váriavel show for true, adiciona a classe block, se for false, adiciona a classe none.
        this.snackModalEl.style.display = (show) ? 'block' : 'none';
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
                    
                    // Fechando a modal de upload, com o método modalShow
                    this.modalShow(false);
                    
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

                    // Fechando a modal de upload, com o método modalShow
                    this.modalShow(false);

                    reject(event);
                };

                //    
                ajax.upload.onprogress = event => {

                    // Chamando o método UploadProgress que recebe o evento de Upload e o arquivo
                    this.uploadProgress(event, file);

                };

                // Usaremos o FormData para passar os arquivos para o Ajax
                let formData = new FormData();

                // pegamos os arquivos que estão passando pelo forEach com a variavel file
                formData.append('input-file', file);

                // recuperando a hora no momento que o upload irá começar
                this.startUploadTime = Date.now();

                // Enviando a requisição
                ajax.send(formData);

            }));

        });        

        // Adicionando o array ao promise all, caso todas promessas passarem retorna, se falhar rejeita
        return Promise.all(promises);

    }

    // Método para atualizar a barra de progresso
    uploadProgress(event, file){

        // Calculando o tempo gasto no upload do arquivo
        let timespent = Date.now() - this.startUploadTime

        // pega o atributo loaded, dentro do event de upload
        let loaded = event.loaded;

        // pega o atributo total, dentro do event de upload
        let total = event.total;

        // faz a regra de 3 para saber a porcentagem carregada
        let porcent = parseInt((loaded / total) * 100);

        // Calculando o tempo restante para o upload
        let timeleft = ((100 - porcent) * timespent) / porcent
        
        // atualiza a propriedade css width da progress bar com a porcentagem atual do upload
        this.progressBarEl.style.width = `${porcent}%`

        // atualizando o label como o arquivo que esta subindo
        this.nameFileEl.innerHTML = file.name;

        // atualizando o tempo que falta para terminar o Upload
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeleft);

        console.log(timespent, timeleft, porcent);
    };

    // Método para formatar o tempo de upload de milisegundos para um formato amigável
    formatTimeToHuman(duration){
        
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if (seconds > 0) {
            return `${seconds} segundos`;
        }
        return '';

    };
}