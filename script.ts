interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => 
    document.querySelector(query);

    function calcTime(mil: number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function park() {
        function ler(): Veiculo[] {
            return localStorage.park ? JSON.parse(localStorage.park) : [];
        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("park", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function() {
                remover(this.dataset.placa);
            });

            $("#park")?.appendChild(row);

            if(salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

            const time = calcTime(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O veículo ${nome} permaneceu por ${time}. Deseja encerrar?`)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render() {
            $("#park")!.innerHTML = "";
            const park = ler();

            if (park.length) {
                park.forEach(veiculo => adicionar(veiculo))
            }
        }

        return { ler, adicionar, remover, salvar, render };
    }

    park().render()

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }

        park().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();