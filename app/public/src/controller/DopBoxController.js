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

    // Função Inicializadora dos Eventos
    initEvents(){
        
        // Adiciona a Escuta de Eventos no botão send files
        this.btnSendFileEl.addEventListener('click', event => {

            // Quando ocorrer o evento click no botão de Uploads, o inputFile será chamado por este evento click
            this.inputFilesEl.click();

        });

        // Adiciona a Escuta de Eventos no Input, e no change "Mudança", ou seja, quando forem selecionados arquivos, pega o evento
        this.inputFilesEl.addEventListener('change', event => {

            // Quando ocorrer o evento, a mudança, adiciona o CSS, para exibir o modal via CSS
            this.snackModalEl.style.display = 'block'

        });
    }
}