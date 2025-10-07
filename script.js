// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do nosso widget
    const statusMessage = document.getElementById('status-message');
    const sunshineOutput = document.getElementById('sunshine-output');

    // Função para converter segundos em uma string "X horas e Y minutos"
    function formatarDuracaoSol(totalSegundos) {
        if (totalSegundos === 0) {
            return "Nenhuma luz solar direta registrada hoje.";
        }
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);

        return `Sua região teve aproximadamente <strong class="sunshine-result">${horas} horas e ${minutos} minutos de sol</strong>!`;
    }

    // Função que é chamada se o usuário PERMITIR a geolocalização
    function sucessoNaLocalizacao(posicao) {
        statusMessage.textContent = 'Calculando o potencial solar...';

        const latitude = posicao.coords.latitude;
        const longitude = posicao.coords.longitude;

        // Montamos a URL da Open-Meteo pedindo o dado "sunshine_duration" para o dia atual ("daily")
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunshine_duration&timezone=America/Sao_Paulo`;

        // Faz a chamada à API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // O resultado vem em um array, pegamos o primeiro item [0] que é o de hoje
                const duracaoSolSegundos = data.daily.sunshine_duration[0];
                
                // Formata e exibe o resultado
                sunshineOutput.innerHTML = formatarDuracaoSol(duracaoSolSegundos);
                statusMessage.style.display = 'none'; // Esconde a mensagem de status
            })
            .catch(error => {
                console.error("Erro ao buscar dados da Open-Meteo:", error);
                statusMessage.textContent = 'Não foi possível calcular os dados de sol para sua região.';
            });
    }

    // Função que é chamada se o usuário NEGAR ou se der erro
    function erroNaLocalizacao() {
        statusMessage.textContent = 'Não foi possível acessar sua localização. O cálculo de potencial solar não pôde ser realizado.';
        sunshineOutput.innerHTML = 'Para uma simulação precisa, entre em contato conosco.';
    }

    // Ponto de partida: verifica se o navegador tem suporte e pede a localização
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(sucessoNaLocalizacao, erroNaLocalizacao);
    } else {
        statusMessage.textContent = "Geolocalização não é suportada pelo seu navegador.";
    }

});
