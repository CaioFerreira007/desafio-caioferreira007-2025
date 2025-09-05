class AbrigoAnimais {
  constructor() {
    this.animais = {
      REX: { nome: "Rex", tipo: "cao", favoritos: ["RATO", "BOLA"] },
      MIMI: { nome: "Mimi", tipo: "gato", favoritos: ["BOLA", "LASER"] },
      FOFO: {
        nome: "Fofo",
        tipo: "gato",
        favoritos: ["BOLA", "RATO", "LASER"],
      },
      ZERO: { nome: "Zero", tipo: "gato", favoritos: ["RATO", "BOLA"] },
      BOLA: { nome: "Bola", tipo: "cao", favoritos: ["CAIXA", "NOVELO"] },
      BEBE: { nome: "Bebe", tipo: "cao", favoritos: ["LASER", "RATO", "BOLA"] },
      LOCO: { nome: "Loco", tipo: "jabuti", favoritos: ["SKATE", "RATO"] },
    };

    this.brinquedosValidos = new Set([
      "RATO",
      "BOLA",
      "LASER",
      "CAIXA",
      "NOVELO",
      "SKATE",
    ]);
  }

  converterEntrada(texto) {
    if (typeof texto !== "string" || texto.trim() === "") return [];
    return texto
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item.length > 0);
  }

  temDuplicatas(lista) {
    return new Set(lista).size !== lista.length;
  }

  verificarOrdem(favoritos, brinquedos) {
    let posicao = 0;
    for (const f of favoritos) {
      let achou = false;
      for (let i = posicao; i < brinquedos.length; i++) {
        if (brinquedos[i] === f) {
          posicao = i + 1;
          achou = true;
          break;
        }
      }
      if (!achou) return false;
    }
    return true;
  }

  temTodos(brinquedos, necessarios) {
    const set = new Set(brinquedos);
    return necessarios.every((x) => set.has(x));
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const toys1 = this.converterEntrada(brinquedosPessoa1);
    const toys2 = this.converterEntrada(brinquedosPessoa2);
    const animaisList = this.converterEntrada(ordemAnimais);

    // Valida brinquedos
    const todosBrinquedos = [...toys1, ...toys2];
    if (todosBrinquedos.some((b) => !this.brinquedosValidos.has(b))) {
      return { erro: "Brinquedo inválido" };
    }
    if (this.temDuplicatas(toys1) || this.temDuplicatas(toys2)) {
      return { erro: "Brinquedo inválido" };
    }

    // Valida animais
    if (animaisList.some((a) => !this.animais[a])) {
      return { erro: "Animal inválido" };
    }
    if (this.temDuplicatas(animaisList)) {
      return { erro: "Animal inválido" };
    }

    // Estado por pessoa: quantidade adotada e se já tem gato
    const estado = [
      { qtd: 0, temGato: false }, // pessoa 1
      { qtd: 0, temGato: false }, // pessoa 2
    ];

    const checaPessoa = (pIdx, toys, animal) => {
      const p = estado[pIdx];
      if (p.qtd >= 3) return false;

      if (animal.tipo === "gato") {
        // Gato só pode se a pessoa ainda não tem nenhum animal
        if (p.qtd > 0) return false;
        return this.verificarOrdem(animal.favoritos, toys);
      } else {
        // Se já tem gato, não pode adotar mais ninguém
        if (p.temGato) return false;

        if (animal.nome === "Loco") {
          // Loco ignora ordem **apenas se já houver companhia**
          if (p.qtd > 0) return this.temTodos(toys, animal.favoritos);
          // sem companhia, precisa respeitar a ordem
          return this.verificarOrdem(animal.favoritos, toys);
        }

        return this.verificarOrdem(animal.favoritos, toys);
      }
    };

    const resultado = [];

    for (const animalKey of animaisList) {
      const animal = this.animais[animalKey];

      const pode1 = checaPessoa(0, toys1, animal);
      const pode2 = checaPessoa(1, toys2, animal);

      let destino = "abrigo";
      if (pode1 && pode2) {
        destino = "abrigo"; // empate
      } else if (pode1) {
        destino = "pessoa 1";
        estado[0].qtd++;
        if (animal.tipo === "gato") estado[0].temGato = true;
      } else if (pode2) {
        destino = "pessoa 2";
        estado[1].qtd++;
        if (animal.tipo === "gato") estado[1].temGato = true;
      }

      resultado.push(`${animal.nome} - ${destino}`);
    }

    resultado.sort((a, b) =>
      a.split(" - ")[0].localeCompare(b.split(" - ")[0])
    );
    return { lista: resultado };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
