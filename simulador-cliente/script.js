const valorInput = document.getElementById("valor");
const bandeiraRadios = document.querySelectorAll('input[name="bandeira"]');
const tipoCalculoRadios = document.querySelectorAll('input[name="tipo-calculo"]');
const tabelaParcelas = document.getElementById("tabelaParcelas");
const calcularButton = document.getElementById("calcular");

function formatarValor(valor) {
    return parseFloat(valor.replace(/\D/g, "")) / 100;
}

function formatarValorExibicao(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularParcelas() {
    tabelaParcelas.innerHTML = "";

    const valorFormatado = formatarValor(valorInput.value);

    const bandeiraSelecionada = document.querySelector('input[name="bandeira"]:checked').value;
    const tipoCalculo = document.querySelector('input[name="tipo-calculo"]:checked').value;

    const jurosPorBandeira = {
        mastercard: {
            debito: 0.0153,
            credito: [0.0242, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0321, 0.0321, 0.0321, 0.0321, 0.0321, 0.0321]
        },
        visa: {
            debito: 0.0153,
            credito: [0.0242, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0321, 0.0321, 0.0321, 0.0321, 0.0321, 0.0321]
        },
        elo: {
            debito: 0.0207,
            credito: [0.0323, 0.0361, 0.0361, 0.0361, 0.0361, 0.0361, 0.0411, 0.0411, 0.0411, 0.0411, 0.0411, 0.0411]
        },
        hiper: {
            debito: 0.0207,
            credito: [0.0323, 0.0361, 0.0361, 0.0361, 0.0361, 0.0361, 0.0411, 0.0411, 0.0411, 0.0411, 0.0411, 0.0411]
        }
    };

    if (tipoCalculo === "debito") {
        tabelaParcelas.innerHTML = `
        <tr>
            <th>Quantidade de Parcelas</th>
            <th>Recebe em 1 dia</th>
        </tr>
      `;
        
        const tr = document.createElement("tr");
        const tdParcela = document.createElement("td");
        const tdValorReceber = document.createElement("td");
        

        tdParcela.textContent = "Débito à vista";
        tr.appendChild(tdParcela);

        const valorReceber = valorFormatado - (valorFormatado * jurosPorBandeira[bandeiraSelecionada].debito);
        

        tdValorReceber.textContent = formatarValorExibicao(valorReceber);
        
        tr.appendChild(tdValorReceber);
        

        tabelaParcelas.appendChild(tr);
    } else if (tipoCalculo === "cliente") {
        tabelaParcelas.innerHTML = `
            <tr>
                <th>Parcelas</th>
                <th>Valor da Parcela</th>
                <th>Total Cliente</th>
                <th class="recebe-col">Você recebe</th>
            </tr>
        `;
        for (let parcela = 1; parcela <= 12; parcela++) {
            
            const tr = document.createElement("tr");
            const tdParcela = document.createElement("td");
            const tdValorReceber = document.createElement("td");
            const tdValorTotal = document.createElement("td");
            const tdValorLojista = document.createElement("td");
        
            if (parcela === 1){
                tdParcela.textContent = 'Crédito à vista'
            } else {
                tdParcela.textContent = `${parcela}x`;
            }
            tr.appendChild(tdParcela);
        
            const valorReceber = (valorFormatado + (valorFormatado * jurosPorBandeira[bandeiraSelecionada].credito[parcela - 1]) + (parcela * 0.0149 * valorFormatado)) / parcela;
            const valorTotal = valorFormatado + (valorFormatado * jurosPorBandeira[bandeiraSelecionada].credito[parcela - 1]) + (parcela * 0.0149 * valorFormatado)
            const valorLojista = valorFormatado;

            tdValorReceber.textContent = formatarValorExibicao(valorReceber);
            tdValorTotal.textContent = formatarValorExibicao(valorTotal);
            tdValorLojista.textContent = formatarValorExibicao(valorLojista);

            tr.appendChild(tdValorReceber);
            tr.appendChild(tdValorTotal);
            tr.appendChild(tdValorLojista);
        
            tabelaParcelas.appendChild(tr);
        }
    } else {
            tabelaParcelas.innerHTML = `
            <tr>
                <th>Quantidade de Parcelas</th>
                <th>Recebe em 1 dia</th>
            </tr>
        `;
        for (let parcela = 1; parcela <= 12; parcela++) {
            
            const tr = document.createElement("tr");
            const tdParcela = document.createElement("td");
            const tdValorReceber = document.createElement("td");
        
            if (parcela === 1){
                tdParcela.textContent = 'Crédito à vista'
            } else {
                tdParcela.textContent = `${parcela}x`;
            }
            tr.appendChild(tdParcela);
        
            const valorReceber = valorFormatado - (valorFormatado * jurosPorBandeira[bandeiraSelecionada].credito[parcela - 1]) - (parcela * 0.0149 * valorFormatado);
            
            tdValorReceber.textContent = formatarValorExibicao(valorReceber);

            tr.appendChild(tdValorReceber);
        
            tabelaParcelas.appendChild(tr);
        }
        
    }
}

valorInput.addEventListener("input", () => {
    const valorFormatado = formatarValor(valorInput.value);
    valorInput.value = formatarValorExibicao(valorFormatado);
});

calcularButton.addEventListener("click", calcularParcelas);
bandeiraRadios.forEach(radio => radio.addEventListener("change", calcularParcelas));
tipoCalculoRadios.forEach(radio => radio.addEventListener("change", calcularParcelas));

// Inicializar a tabela de parcelas ao carregar a página
calcularParcelas();
