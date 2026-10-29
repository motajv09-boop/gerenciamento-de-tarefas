
const form = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const lista = document.getElementById("lista-tarefas");
const mensagemErro = document.getElementById("mensagem-erro");
const mensagemVazia = document.getElementById("mensagem-vazia");
const botoesFiltro = document.querySelectorAll(".filtro");
const botaoLimpar = document.getElementById("limpar-concluidas");

// Estado da aplicação
let tarefas = [];
let proximoId = 1;
let filtroAtual = "todas";

// Adicionar tarefa
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const texto = input.value.trim();

  // Impede tarefas vazias ou com apenas espaços
  if (texto === "") {
    mensagemErro.textContent =
      "Digite uma tarefa antes de adicionar!";
    input.focus();
    return;
  }

  const novaTarefa = {
    id: proximoId++,
    texto: texto,
    concluida: false
  };

  // Atualiza o estado sem modificar o array anterior
  tarefas = [...tarefas, novaTarefa];

  input.value = "";
  mensagemErro.textContent = "";

  renderizar();
});

// Filtros
botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    filtroAtual = botao.dataset.filtro;

    botoesFiltro.forEach(function (item) {
      item.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    renderizar();
  });
});

// Marcar como concluída ou pendente
function alternarStatus(id) {
  tarefas = tarefas.map(function (tarefa) {
    if (tarefa.id === id) {
      return {
        ...tarefa,
        concluida: !tarefa.concluida
      };
    }

    return tarefa;
  });

  renderizar();
}

// Excluir tarefa
function excluirTarefa(id) {
  tarefas = tarefas.filter(function (tarefa) {
    return tarefa.id !== id;
  });

  renderizar();
}

// Excluir todas as tarefas concluídas
botaoLimpar.addEventListener("click", function () {
  tarefas = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  });

  renderizar();
});

// Atualiza a interface com base no estado
function renderizar() {
  const total = tarefas.length;

  const pendentes = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  }).length;

  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida;
  }).length;

  // Atualizar contadores
  document.getElementById("contador-total").textContent = total;
  document.getElementById("contador-pendente").textContent = pendentes;
  document.getElementById("contador-concluida").textContent = concluidas;

  document.getElementById("filtro-total").textContent = total;
  document.getElementById("filtro-pendente").textContent = pendentes;
  document.getElementById("filtro-concluida").textContent = concluidas;

  // Aplicar filtro selecionado
  const tarefasFiltradas = tarefas.filter(function (tarefa) {
    if (filtroAtual === "pendente") {
      return !tarefa.concluida;
    }

    if (filtroAtual === "concluida") {
      return tarefa.concluida;
    }

    return true;
  });

  lista.innerHTML = "";

  // Mensagem quando não existem tarefas no filtro
  mensagemVazia.hidden = tarefasFiltradas.length > 0;

  if (tarefasFiltradas.length === 0) {
    mensagemVazia.textContent =
      total === 0
        ? "Nenhuma tarefa cadastrada."
        : "Nenhuma tarefa encontrada neste filtro.";
  }

  // Renderizar tarefas
  tarefasFiltradas.forEach(function (tarefa) {
    const item = document.createElement("li");
    item.className = "tarefa";

    if (tarefa.concluida) {
      item.classList.add("concluida");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute(
      "aria-label",
      "Marcar " + tarefa.texto + " como concluída"
    );

    checkbox.addEventListener("change", function () {
      alternarStatus(tarefa.id);
    });

    const conteudo = document.createElement("div");
    conteudo.className = "texto-tarefa";

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    const status = document.createElement("small");
    status.className = "status";
    status.textContent = tarefa.concluida
      ? "Concluída"
      : "Pendente";

    conteudo.append(texto, status);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.className = "excluir";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.setAttribute(
      "aria-label",
      "Excluir tarefa: " + tarefa.texto
    );

    botaoExcluir.addEventListener("click", function () {
      excluirTarefa(tarefa.id);
    });

    item.append(checkbox, conteudo, botaoExcluir);
    lista.appendChild(item);
  });

  botaoLimpar.disabled = concluidas === 0;
}

// Renderização inicial
renderizar();
