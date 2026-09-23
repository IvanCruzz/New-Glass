document.addEventListener('DOMContentLoaded', () => {
    const funcionarioNome = document.getElementById('funcionario-nome');
    const logoutBtn = document.getElementById('logout-btn');

    const addPecaBtn = document.getElementById('add-peca-btn');
    const modalPeca = document.getElementById('modal-peca');
    const fecharModalBtn = document.getElementById('fechar-modal-btn');
    const formPeca = document.getElementById('form-peca');
    const pecaMessage = document.getElementById('peca-message');

    const selectDesenvolvedor = document.getElementById('desenvolvedor');
    const selectSigla = document.getElementById('sigla');

const modalEditarPeca =
    document.getElementById('modal-editar-peca');

const fecharModalEditar =
    document.getElementById('fechar-modal-editar');

const formEditarPeca =
    document.getElementById('form-editar-peca');

const editarMessage =
    document.getElementById('editar-peca-message');

const editarSigla =
    document.getElementById('editar-sigla');

const editarModelo =
    document.getElementById('editar-modelo');

const editarOs =
    document.getElementById('editar-os');

const editarQr =
    document.getElementById('editar-qr');

const editarDesenvolvedor =
    document.getElementById('editar-desenvolvedor');

const editarResponsavelEstoque =
    document.getElementById('editar-responsavel-estoque');

const editarResponsavelEmbalagem =
    document.getElementById('editar-responsavel-embalagem');

const editarEntregador =
    document.getElementById('editar-entregador');

const editarObservacao =
    document.getElementById('editar-observacao');

let pecaSelecionadaEdicao = null;
    const modalEmbalagem = document.getElementById('modal-embalagem');
  const observacaoInput = document.getElementById('observacao');
const fecharModalEmbalagem = document.getElementById(
    'fechar-modal-embalagem'
);
  
const formEmbalagem = document.getElementById('form-embalagem');
const selectResponsavelEmbalagem = document.getElementById(
    'responsavel-embalagem'
);
const embalagemMessage = document.getElementById('embalagem-message');
  const modalEntregador = document.getElementById('modal-entregador');

const fecharModalEntregador = document.getElementById(
    'fechar-modal-entregador'
);

const formEntregador = document.getElementById('form-entregador');

const selectEntregador = document.getElementById('select-entregador');

const entregadorMessage = document.getElementById('entregador-message');

let pecaSelecionadaEntregador = null;

let pecaSelecionadaEmbalagem = null;
  const addSiglaBtn = document.getElementById('add-sigla-btn');
const modalSigla = document.getElementById('modal-sigla');
const fecharModalSigla = document.getElementById('fechar-modal-sigla');
const formSigla = document.getElementById('form-sigla');
const novaSiglaInput = document.getElementById('nova-sigla');
const mensagemSigla = document.getElementById('mensagem-sigla');
  addSiglaBtn.addEventListener('click', () => {
    modalSigla.classList.add('ativo');
    novaSiglaInput.value = '';
    mensagemSigla.textContent = '';
    novaSiglaInput.focus();
});

fecharModalSigla.addEventListener('click', () => {
    modalSigla.classList.remove('ativo');
});
  formSigla.addEventListener('submit', async (event) => {
    event.preventDefault();

    const sigla = novaSiglaInput.value.trim().toUpperCase();

    if (!sigla) {
        mensagemSigla.textContent = 'Digite uma sigla.';
        return;
    }

    mensagemSigla.textContent = 'Cadastrando...';

    const { error } = await supabaseClient
        .from('siglas')
        .insert({
            sigla: sigla
        });

    if (error) {
        if (error.code === '23505') {
            mensagemSigla.textContent = 'Essa sigla já está cadastrada.';
        } else {
            console.error(error);
            mensagemSigla.textContent = 'Erro ao cadastrar a sigla.';
        }

        return;
    }

    mensagemSigla.textContent = 'Sigla cadastrada com sucesso!';

    await carregarSiglas();

    setTimeout(() => {
        modalSigla.classList.remove('ativo');
    }, 800);
});
  const pesquisaInput = document.getElementById('pesquisa-pecas');
  const addFuncionarioBtn = document.getElementById(
    'add-funcionario-btn'
);

const modalFuncionario = document.getElementById(
    'modal-funcionario'
);

const fecharModalFuncionario = document.getElementById(
    'fechar-modal-funcionario'
);

const formFuncionario = document.getElementById(
    'form-funcionario'
);

const funcionarioNomeInput = document.getElementById(
    'funcionario-nome-input'
);

const funcionarioEmailInput = document.getElementById(
    'funcionario-email'
);

const funcionarioSenhaInput = document.getElementById(
    'funcionario-senha'
);

const funcionarioMessage = document.getElementById(
    'funcionario-message'
);

pesquisaInput.addEventListener('input', () => {
    const termo = pesquisaInput.value.toLowerCase().trim();

    const secaoAtiva = document.querySelector('.painel-section.active');

    if (!secaoAtiva) return;

    const cards = secaoAtiva.querySelectorAll('.peca-card');

    cards.forEach((card) => {
        const textoCard = card.textContent.toLowerCase();

        card.style.display = textoCard.includes(termo)
            ? ''
            : 'none';
    });
});
  
  // Carrega as peças aguardando saída para entrega
async function carregarPecasEntregas() {
    const lista = document.getElementById('lista-entregas');

    lista.innerHTML = '<p>Carregando entregas...</p>';

    const { data, error } = await supabaseClient
        .from('pecas')
        .select(`
            id,
            status,
            modelo_carro,
            os, 
            observacao,
            codigo_qr,
            atualizado_em,
            historico_pecas (
    data_hora,
    tipo_evento
),
            funcionarios (
                nome
            ),
            siglas (
                sigla
            ),
            saidas_entrega (
                entregador_id,
                data_hora_saida,
                funcionarios (
                    nome
                )
            )
        `)
        .in('status', ['AGUARDANDO_SAIDA', 'SAIU_PARA_ENTREGA'])
        .order('atualizado_em', { ascending: false });

    if (error) {
        console.error('Erro ao carregar entregas:', error);
        lista.innerHTML = '<p>Erro ao carregar as entregas.</p>';
        return;
    }

    if (data.length === 0) {
        lista.innerHTML =
            '<p>Nenhuma peça aguardando saída.</p>';
        return;
    }

    lista.innerHTML = '';

    data.forEach((peca) => {
      const eventoEntradaEntrega = peca.historico_pecas?.find(
    (evento) => evento.tipo_evento === 'ENTREGADOR_DEFINIDO'
);

const horarioEntradaEntrega = eventoEntradaEntrega?.data_hora
    ? new Date(eventoEntradaEntrega.data_hora).toLocaleString('pt-BR')
    : 'Não informado';

const eventoSaidaEntrega = peca.historico_pecas?.find(
    (evento) => evento.tipo_evento === 'SAIDA_PARA_ENTREGA'
);

const horarioSaidaEntrega = eventoSaidaEntrega?.data_hora
    ? new Date(eventoSaidaEntrega.data_hora).toLocaleString('pt-BR')
    : '-/-';
        const saida = Array.isArray(peca.saidas_entrega)
            ? peca.saidas_entrega[0]
            : peca.saidas_entrega;

        const card = document.createElement('article');

const entregaRealizada = peca.status === 'SAIU_PARA_ENTREGA';

card.classList.add('peca-card');

if (entregaRealizada) {
    card.classList.add('status-estoque');
} else {
    card.classList.add('aguardando-saida');
}

        card.classList.add('peca-card', 'card-entrega');

        card.innerHTML = `
            <h3>${peca.siglas?.sigla || 'Sem sigla'}</h3>

            <p>
                <strong>Modelo:</strong>
                ${peca.modelo_carro}
            </p>

            <p>
                <strong>OS:</strong>
                ${peca.os}
            </p>

            <p>
                <strong>Código QR:</strong>
                ${peca.codigo_qr}
            </p>

            <p>
                <strong>Desenvolvedor:</strong>
                ${peca.funcionarios?.nome || 'Não informado'}
            </p>

            <p>
                <strong>Entregador:</strong>
                ${saida?.funcionarios?.nome || 'Não informado'}
            </p>
            <p>
    <strong>Entrada em Entregas:</strong>
    ${horarioEntradaEntrega}
</p>

<p>
    <strong>Saída para entrega:</strong>
    ${horarioSaidaEntrega}
</p>
            <p>
    <strong>Observação:</strong>
    ${peca.observacao || 'Nenhuma'}
</p>

            <button
    type="button"
    class="registrar-saida-btn"
    data-id="${peca.id}"
    ${entregaRealizada ? 'disabled' : ''}
>
    ${entregaRealizada ? '✓ Saída registrada' : 'Registrar saída'}
</button>
<button
    type="button"
    class="editar-peca-btn"
    data-id="${peca.id}">
    Editar
</button>
        `;

        lista.appendChild(card);
    });
}
  // Registra a saída da peça para entrega
const listaEntregas = document.getElementById('lista-entregas');

listaEntregas.addEventListener('click', async (event) => {
    const botao = event.target.closest('.registrar-saida-btn');

    if (!botao) return;

    const pecaId = botao.dataset.id;

    const confirmar = confirm(
        'Tem certeza que esta peça saiu para entrega?'
    );

    if (!confirmar) return;

    botao.disabled = true;
    botao.textContent = 'Registrando saída...';

    try {
        const { error } = await supabaseClient.rpc(
            'registrar_saida_entrega',
            {
                p_peca_id: pecaId
            }
        );

        if (error) throw error;

        alert('Saída registrada com sucesso!');

        await carregarPecasEntregas();

    } catch (error) {
        console.error('Erro ao registrar saída:', error);

        alert(
            error.message ||
            'Não foi possível registrar a saída.'
        );

        botao.disabled = false;
        botao.textContent = 'Registrar saída';
    }
});
  carregarPecasEntregas();
  // Carrega os funcionários para o modal de embalagem
async function carregarResponsaveisEmbalagem() {
    selectResponsavelEmbalagem.innerHTML =
        '<option value="">Carregando funcionários...</option>';

    const { data, error } = await supabaseClient
        .from('funcionarios')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

    if (error) {
        console.error(
            'Erro ao carregar responsáveis:',
            error
        );

        selectResponsavelEmbalagem.innerHTML =
            '<option value="">Erro ao carregar</option>';

        return;
    }

    selectResponsavelEmbalagem.innerHTML =
        '<option value="">Selecione o responsável</option>';

    data.forEach((funcionario) => {
        const option = document.createElement('option');

        option.value = funcionario.id;
        option.textContent = funcionario.nome;

        selectResponsavelEmbalagem.appendChild(option);
    });
}
  // Carrega as peças que já foram embaladas
async function carregarPecasEmbaladas() {
    const lista = document.getElementById('lista-embalagem');

    lista.innerHTML = '<p>Carregando peças embaladas...</p>';

    const { data, error } = await supabaseClient
        .from('pecas')
        .select(`
            id,
            modelo_carro,
            os,
            codigo_qr,
            observacao,
            atualizado_em,
            funcionarios (
                nome
            ),
            siglas (
                sigla
            ),
            embalagens (
                data_hora_embalagem,
                responsavel_id,
                funcionarios (
                    nome
                )
            )
        `)
        .eq('status', 'EMBALADA')
        .order('atualizado_em', { ascending: false });

    if (error) {
        console.error('Erro ao carregar embalados:', error);
        lista.innerHTML = '<p>Erro ao carregar as peças embaladas.</p>';
        return;
    }

    if (data.length === 0) {
        lista.innerHTML = '<p>Nenhuma peça embalada.</p>';
        return;
    }

    lista.innerHTML = '';

    data.forEach((peca) => {
        const embalagem = Array.isArray(peca.embalagens)
            ? peca.embalagens[0]
            : peca.embalagens;

        const card = document.createElement('article');

        card.classList.add('peca-card', 'card-embalada','status-embalada');

        card.innerHTML = `
            <h3>${peca.siglas?.sigla || 'Sem sigla'}</h3>

            <p>
                <strong>Modelo:</strong>
                ${peca.modelo_carro}
            </p>

            <p>
                <strong>OS:</strong>
                ${peca.os}
            </p>

            <p>
                <strong>Código QR:</strong>
                ${peca.codigo_qr}
            </p>

            <p>
                <strong>Desenvolvedor:</strong>
                ${peca.funcionarios?.nome || 'Não informado'}
            </p>

            <p>
                <strong>Embalado por:</strong>
                ${embalagem?.funcionarios?.nome || 'Não informado'}
            </p>

            <p>
                <strong>Data da embalagem:</strong>
                ${
                    embalagem?.data_hora_embalagem
                        ? new Date(
                            embalagem.data_hora_embalagem
                        ).toLocaleString('pt-BR')
                        : 'Não informada'
                }
            </p>
            <p>
    <strong>Observação:</strong>
    ${peca.observacao || 'Nenhuma'}
</p>
            <button
    type="button"
    class="definir-entregador-btn"
    data-id="${peca.id}">
    Definir entregador
</button>
        `;

        lista.appendChild(card);
    });
}
  carregarPecasEmbaladas();
  // Carrega os funcionários disponíveis para entrega
async function carregarEntregadores() {
    selectEntregador.innerHTML =
        '<option value="">Carregando funcionários...</option>';

    const { data, error } = await supabaseClient
        .from('funcionarios')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

    if (error) {
        console.error('Erro ao carregar entregadores:', error);

        selectEntregador.innerHTML =
            '<option value="">Erro ao carregar</option>';

        return;
    }

    selectEntregador.innerHTML =
        '<option value="">Selecione o entregador</option>';

    data.forEach((funcionario) => {
        const option = document.createElement('option');

        option.value = funcionario.id;
        option.textContent = funcionario.nome;

        selectEntregador.appendChild(option);
    });
}
  // Abre o modal para definir o entregador
const listaEmbalagem = document.getElementById('lista-embalagem');

listaEmbalagem.addEventListener('click', async (event) => {
    const botao = event.target.closest('.definir-entregador-btn');

    if (!botao) return;

    pecaSelecionadaEntregador = botao.dataset.id;

    entregadorMessage.textContent = '';

    modalEntregador.classList.remove('hidden');

    await carregarEntregadores();
});
  // Fecha o modal de entregador
function fecharModalDeEntregador() {
    modalEntregador.classList.add('hidden');
    formEntregador.reset();
    entregadorMessage.textContent = '';
    pecaSelecionadaEntregador = null;
}

fecharModalEntregador.addEventListener(
    'click',
    fecharModalDeEntregador
);

modalEntregador.addEventListener('click', (event) => {
    if (event.target === modalEntregador) {
        fecharModalDeEntregador();
    }
});
  // Registra o entregador no Supabase
formEntregador.addEventListener('submit', async (event) => {
    event.preventDefault();

    const entregadorId = selectEntregador.value;

    if (!pecaSelecionadaEntregador) {
        entregadorMessage.textContent =
            'Nenhuma peça foi selecionada.';

        return;
    }

    if (!entregadorId) {
        entregadorMessage.textContent =
            'Selecione um entregador.';

        return;
    }

    entregadorMessage.textContent = 'Registrando entregador...';

    const botaoSubmit = formEntregador.querySelector(
        'button[type="submit"]'
    );

    botaoSubmit.disabled = true;

    try {
        const { error } = await supabaseClient.rpc(
            'registrar_entregador',
            {
                p_peca_id: pecaSelecionadaEntregador,
                p_entregador_id: entregadorId
            }
        );

        if (error) throw error;

        entregadorMessage.textContent =
            'Entregador definido com sucesso!';

        await carregarPecasEmbaladas();

        // Atualiza a futura lista de entregas, caso já exista
        if (typeof carregarPecasEntregas === 'function') {
            await carregarPecasEntregas();
        }

        setTimeout(() => {
            fecharModalDeEntregador();
        }, 1000);

    } catch (error) {
        console.error('Erro ao definir entregador:', error);

        entregadorMessage.textContent =
            error.message || 'Erro ao definir o entregador.';

    } finally {
        botaoSubmit.disabled = false;
    }
});
  // Abre o modal ao clicar em Embalar
const listaEstoque = document.getElementById('lista-estoque');

listaEstoque.addEventListener('click', async (event) => {
    const botao = event.target.closest('.embalar-peca-btn');

    if (!botao) return;

    pecaSelecionadaEmbalagem = botao.dataset.id;

    embalagemMessage.textContent = '';

    modalEmbalagem.classList.remove('hidden');

    await carregarResponsaveisEmbalagem();
});
  // Fecha o modal de embalagem
function fecharModalDeEmbalagem() {
    modalEmbalagem.classList.add('hidden');
    formEmbalagem.reset();
    embalagemMessage.textContent = '';
    pecaSelecionadaEmbalagem = null;
}

fecharModalEmbalagem.addEventListener(
    'click',
    fecharModalDeEmbalagem
);

modalEmbalagem.addEventListener('click', (event) => {
    if (event.target === modalEmbalagem) {
        fecharModalDeEmbalagem();
    }
});
  // Registra a embalagem no Supabase
formEmbalagem.addEventListener('submit', async (event) => {
    event.preventDefault();

    const responsavelId = selectResponsavelEmbalagem.value;

    if (!pecaSelecionadaEmbalagem) {
        embalagemMessage.textContent =
            'Nenhuma peça foi selecionada.';
        return;
    }

    if (!responsavelId) {
        embalagemMessage.textContent =
            'Selecione quem embalou a peça.';
        return;
    }

    embalagemMessage.textContent = 'Registrando embalagem...';

    const botaoSubmit = formEmbalagem.querySelector(
        'button[type="submit"]'
    );

    botaoSubmit.disabled = true;

    try {
        const { error } = await supabaseClient.rpc(
            'registrar_embalagem',
            {
                p_peca_id: pecaSelecionadaEmbalagem,
                p_responsavel_id: responsavelId
            }
        );

        if (error) throw error;

        embalagemMessage.textContent =
            'Embalagem registrada com sucesso!';

        await carregarPecasEstoque();
        await carregarPecasEmbaladas();

        setTimeout(() => {
            fecharModalDeEmbalagem();
        }, 1000);

    } catch (error) {
        console.error('Erro ao registrar embalagem:', error);

        embalagemMessage.textContent =
            error.message || 'Erro ao registrar a embalagem.';

    } finally {
        botaoSubmit.disabled = false;
    }
});
  

    // Exibe o nome do funcionário
    function atualizarNomeFuncionario() {
        if (window.funcionarioLogado) {
            funcionarioNome.textContent =
                `Olá, ${window.funcionarioLogado.nome}!`;
        }
    }

    atualizarNomeFuncionario();

    document.addEventListener('funcionarioCarregado', () => {
        atualizarNomeFuncionario();
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error('Erro ao sair:', error);
            return;
        }

        window.location.href = 'login.html';
    });

    // Navegação entre as seções
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.painel-section');

    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;

            navButtons.forEach((btn) => btn.classList.remove('active'));
            sections.forEach((section) => section.classList.remove('active'));

            button.classList.add('active');

            const section = document.getElementById(sectionId);

            if (section) {
                section.classList.add('active');
            }
        });
    });

    // Abre o modal
    addPecaBtn.addEventListener('click', async () => {
        modalPeca.classList.remove('hidden');
        pecaMessage.textContent = '';

        await carregarDesenvolvedores();
        await carregarSiglas();
    });

    // Fecha o modal pelo botão X
    fecharModalBtn.addEventListener('click', () => {
        modalPeca.classList.add('hidden');
        formPeca.reset();
        pecaMessage.textContent = '';
    });

    // Fecha o modal ao clicar fora dele
    modalPeca.addEventListener('click', (event) => {
        if (event.target === modalPeca) {
            modalPeca.classList.add('hidden');
            formPeca.reset();
            pecaMessage.textContent = '';
        }
    });

    // Carrega os funcionários no select
    async function carregarDesenvolvedores() {
        selectDesenvolvedor.innerHTML =
            '<option value="">Carregando funcionários...</option>';

        const { data, error } = await supabaseClient
            .from('funcionarios')
            .select('id, nome')
            .eq('ativo', true)
            .order('nome');

        if (error) {
            console.error('Erro ao carregar funcionários:', error);
            selectDesenvolvedor.innerHTML =
                '<option value="">Erro ao carregar</option>';
            return;
        }

        selectDesenvolvedor.innerHTML =
            '<option value="">Selecione o desenvolvedor</option>';

        data.forEach((funcionario) => {
            const option = document.createElement('option');

            option.value = funcionario.id;
            option.textContent = funcionario.nome;

            selectDesenvolvedor.appendChild(option);
        });
    }

    // Carrega as siglas no select
    async function carregarSiglas() {
        selectSigla.innerHTML =
            '<option value="">Carregando siglas...</option>';

        const { data, error } = await supabaseClient
            .from('siglas')
            .select('id, sigla')
            .order('sigla');

        if (error) {
            console.error('Erro ao carregar siglas:', error);
            selectSigla.innerHTML =
                '<option value="">Erro ao carregar</option>';
            return;
        }

        selectSigla.innerHTML =
            '<option value="">Selecione a sigla</option>';

        data.forEach((item) => {
            const option = document.createElement('option');

            option.value = item.id;
            option.textContent = item.sigla;

            selectSigla.appendChild(option);
        });
    }

    // Cadastra a peça
    formPeca.addEventListener('submit', async (event) => {
        event.preventDefault();

        pecaMessage.textContent = 'Cadastrando peça...';

        const desenvolvedorId = selectDesenvolvedor.value;
        const siglaId = selectSigla.value;
        const modeloCarro = document
            .getElementById('modelo-carro')
            .value
            .trim();
        const os = document
            .getElementById('os')
            .value
            .trim();
        const codigoQr = document
            .getElementById('codigo-qr')
            .value
            .trim();
      const observacao = observacaoInput.value.trim();

        if (!desenvolvedorId || !siglaId) {
            pecaMessage.textContent =
                'Selecione o desenvolvedor e a sigla.';
            return;
        }

        if (!/^[0-9]{4}$/.test(codigoQr)) {
            pecaMessage.textContent =
                'O código QR deve conter exatamente 4 números.';
            return;
        }

        try {
            const {
                data: usuarioData,
                error: usuarioError
            } = await supabaseClient.auth.getUser();

            if (usuarioError || !usuarioData.user) {
                throw new Error('Usuário não autenticado.');
            }

            const { error } = await supabaseClient
                .from('pecas')
                .insert({
                    desenvolvedor_id: desenvolvedorId,
                    sigla_id: siglaId,
                    modelo_carro: modeloCarro,
                    os: os,
                    codigo_qr: codigoQr,
                    observacao: observacao,
                    criado_por: usuarioData.user.id
                });

            if (error) {
                throw error;
            }

            pecaMessage.textContent = 'Peça cadastrada com sucesso!';

            formPeca.reset();

            setTimeout(() => {
                modalPeca.classList.add('hidden');
                pecaMessage.textContent = '';
            }, 1000);

            carregarPecasDesenvolvimento();

        } catch (error) {
            console.log('Erro ao cadastrar peça:', error);

            if (error.code === '23505') {
                pecaMessage.textContent =
                    'A OS ou o código QR informado já está cadastrado.';
            } else {
                pecaMessage.textContent =
                    'Erro ao cadastrar a peça.';
            }
        }
    });

    // Carrega as peças em desenvolvimento
    async function carregarPecasDesenvolvimento() {
        const lista = document.getElementById('lista-desenvolvimento');

        lista.innerHTML = '<p>Carregando peças...</p>';

        const { data, error } = await supabaseClient
            .from('pecas')
            .select(`
                id,
                modelo_carro,
                os,
                codigo_qr,
                observacao,
                criado_em,
                funcionarios (
                    nome
                ),
                siglas (
                    sigla
                )
            `)
            .eq('status', 'EM_DESENVOLVIMENTO')
            .order('criado_em', { ascending: false });

        if (error) {
            console.error('Erro ao carregar peças:', error);
            lista.innerHTML = '<p>Erro ao carregar as peças.</p>';
            return;
        }

        if (data.length === 0) {
            lista.innerHTML =
                '<p>Nenhuma peça em desenvolvimento.</p>';
            return;
        }

        lista.innerHTML = '';

        data.forEach((peca) => {
            const card = document.createElement('article');

            card.classList.add('peca-card', 'status-desenvolvimento');

            card.innerHTML = `
                <h3>${peca.siglas?.sigla || 'Sem sigla'}</h3>
                <p><strong>Modelo:</strong> ${peca.modelo_carro}</p>
                <p><strong>OS:</strong> ${peca.os}</p>
                <p><strong>Código QR:</strong> ${peca.codigo_qr}</p>
                <p>
                    <strong>Desenvolvedor:</strong>
                    ${peca.funcionarios?.nome || 'Não informado'}
                </p>
                <p>
    <strong>Início do desenvolvimento:</strong>
    ${
        peca.criado_em
            ? new Date(peca.criado_em).toLocaleString('pt-BR')
            : 'Não informado'
    }
</p>
                <p>
    <strong>Observação:</strong>
    ${peca.observacao || 'Nenhuma'}
</p>
                <button
                    
                    class="concluir-desenvolvimento-btn"
                    data-id="${peca.id}">
                    Concluir desenvolvimento
                </button>
                <button
    type="button"
    class="editar-peca-btn"
    data-id="${peca.id}">
    Editar
</button>
            `;

            lista.appendChild(card);
        });
    }

    // Carrega a lista assim que o painel abre
    carregarPecasDesenvolvimento();
  // Carrega as peças disponíveis no estoque
async function carregarPecasEstoque() {
    const lista = document.getElementById('lista-estoque');

    lista.innerHTML = '<p>Carregando peças...</p>';

    const { data, error } = await supabaseClient
        .from('pecas')
        .select(`
            id,
            modelo_carro,
            os,
            codigo_qr,
            observacao,
            criado_em,
            historico_pecas (
        data_hora,
        tipo_evento
    ),
            funcionarios (
                nome
            ),
            siglas (
                sigla
            )
        `)
        .eq('status', 'NO_ESTOQUE')
        .order('criado_em', { ascending: false });

    if (error) {
        console.error('Erro ao carregar estoque:', error);
        lista.innerHTML = '<p>Erro ao carregar o estoque.</p>';
        return;
    }

    if (data.length === 0) {
        lista.innerHTML = '<p>Nenhuma peça disponível no estoque.</p>';
        return;
    }

    lista.innerHTML = '';

    data.forEach((peca) => {
    const card = document.createElement('article');

    card.classList.add('peca-card', 'card-estoque', 'status-estocado');

    const eventoEstoque = peca.historico_pecas?.find(
        (evento) => evento.tipo_evento === 'DESENVOLVIMENTO_CONCLUIDO'
    );

    const dataEntradaEstoque = eventoEstoque?.data_hora
        ? new Date(eventoEstoque.data_hora).toLocaleString('pt-BR')
        : 'Não informada';

        card.innerHTML = `
            <h3>${peca.siglas?.sigla || 'Sem sigla'}</h3>

            <p>
                <strong>Modelo:</strong>
                ${peca.modelo_carro}
            </p>

            <p>
                <strong>OS:</strong>
                ${peca.os}
            </p>

            <p>
                <strong>Código QR:</strong>
                ${peca.codigo_qr}
            </p>

            <p>
                <strong>Desenvolvedor:</strong>
                ${peca.funcionarios?.nome || 'Não informado'}
            </p>
            <p>
    <strong>Entrada no estoque:</strong>
    ${dataEntradaEstoque}
</p>
<p>
    <strong>Observação:</strong>
    ${peca.observacao || 'Nenhuma'}
</p>

            <button
                type="button"
                class="embalar-peca-btn"
                data-id="${peca.id}">
                Embalar
            </button>
            <button
    type="button"
    class="editar-peca-btn"
    data-id="${peca.id}">
    Editar
</button>
        `;

        lista.appendChild(card);
    });
}
carregarPecasEstoque();
  // Concluir o desenvolvimento de uma peça
const listaDesenvolvimento = document.getElementById(
    'lista-desenvolvimento'
);

listaDesenvolvimento.addEventListener('click', async (event) => {
    const botao = event.target.closest(
        '.concluir-desenvolvimento-btn'
    );

    if (!botao) return;

    const pecaId = botao.dataset.id;

    const confirmar = confirm(
        'Tem certeza que deseja concluir o desenvolvimento desta peça?'
    );

    if (!confirmar) return;

    botao.disabled = true;
    botao.textContent = 'Concluindo...';

    try {
        const { error } = await supabaseClient.rpc(
            'concluir_desenvolvimento',
            {
                p_peca_id: pecaId
            }
        );

        if (error) {
            throw error;
        }

        alert('Desenvolvimento concluído com sucesso!');

        await carregarPecasDesenvolvimento();
        await carregarPecasEstoque();
        await carregarPecasEmbaladas();

    } catch (error) {
        console.error(
            'Erro ao concluir desenvolvimento:',
            error
        );

        alert(
            error.message ||
            'Não foi possível concluir o desenvolvimento.'
        );

        botao.disabled = false;
        botao.textContent = 'Concluir desenvolvimento';
    }
});

  async function carregarFuncionariosEdicao() {

    const { data, error } = await supabaseClient
        .from('funcionarios')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

    if (error) {
        console.error(
            'Erro ao carregar funcionários:',
            error
        );

        return;
    }

    const selects = [
        editarDesenvolvedor,
        editarResponsavelEstoque,
        editarResponsavelEmbalagem,
        editarEntregador
    ];

    selects.forEach((select) => {

        select.innerHTML =
            '<option value="">Não informado</option>';

        data.forEach((funcionario) => {

            const option =
                document.createElement('option');

            option.value = funcionario.id;
            option.textContent = funcionario.nome;

            select.appendChild(option);
        });
    });
  }
  async function abrirModalEdicao(pecaId) {

    editarMessage.textContent = 'Carregando...';

    const { data, error } = await supabaseClient
        .from('pecas')
        .select(`
            id,
            modelo_carro,
            os,
            codigo_qr,
            observacao,
            desenvolvedor_id,
            funcionarios (
                nome
            ),
            siglas (
                id,
                sigla
            ),
            historico_pecas (
                responsavel_id,
                tipo_evento,
                data_hora,
                funcionarios (
                    nome
                )
            ),
            embalagens (
                responsavel_id,
                funcionarios (
                    nome
                )
            ),
            saidas_entrega (
                entregador_id,
                funcionarios (
                    nome
                )
            )
        `)
        .eq('id', pecaId)
        .single();

    if (error) {

        console.error(
            'Erro ao carregar peça para edição:',
            error
        );

        alert('Não foi possível carregar a peça.');

        return;
    }

    pecaSelecionadaEdicao = pecaId;

    const eventoEstoque =
        data.historico_pecas?.find(
            (evento) =>
                evento.tipo_evento ===
                'DESENVOLVIMENTO_CONCLUIDO'
        );

    const embalagem =
        Array.isArray(data.embalagens)
            ? data.embalagens[0]
            : data.embalagens;

    const saida =
        Array.isArray(data.saidas_entrega)
            ? data.saidas_entrega[0]
            : data.saidas_entrega;


    // Campos bloqueados

    editarSigla.value =
        data.siglas?.sigla || '';

    editarModelo.value =
        data.modelo_carro || '';

    editarOs.value =
        data.os || '';

    editarQr.value =
        data.codigo_qr || '';


    // Campos editáveis

    editarObservacao.value =
    data.observacao || '';

editarMessage.textContent = '';

await carregarFuncionariosEdicao();

editarDesenvolvedor.value =
    data.desenvolvedor_id || '';

editarResponsavelEstoque.value =
    eventoEstoque?.responsavel_id || '';

editarResponsavelEmbalagem.value =
    embalagem?.responsavel_id || '';

editarEntregador.value =
    saida?.entregador_id || '';

modalEditarPeca.classList.remove('hidden');


    // Recoloca os valores depois de carregar os selects

    editarDesenvolvedor.value =
        data.desenvolvedor_id || '';

    editarResponsavelEstoque.value =
        eventoEstoque?.responsavel_id || '';

    editarResponsavelEmbalagem.value =
        embalagem?.responsavel_id || '';

    editarEntregador.value =
        saida?.entregador_id || '';
  }
  fecharModalEditar.addEventListener(
    'click',
    () => {

        modalEditarPeca.classList.add('hidden');

        formEditarPeca.reset();

        pecaSelecionadaEdicao = null;
    }
);


modalEditarPeca.addEventListener(
    'click',
    (event) => {

        if (event.target === modalEditarPeca) {

            modalEditarPeca.classList.add('hidden');

            formEditarPeca.reset();

            pecaSelecionadaEdicao = null;
        }
    }
);
  formEditarPeca.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();

        if (!pecaSelecionadaEdicao) {
            return;
        }

        editarMessage.textContent =
            'Salvando alterações...';

        const botao =
            formEditarPeca.querySelector(
                'button[type="submit"]'
            );

        botao.disabled = true;

        try {

            const { error } =
                await supabaseClient.rpc(
                    'editar_peca',
                    {
                        p_peca_id:
                            pecaSelecionadaEdicao,

                        p_desenvolvedor_id:
                            editarDesenvolvedor.value,

                        p_responsavel_estoque_id:
                            editarResponsavelEstoque.value
                            || null,

                        p_responsavel_embalagem_id:
                            editarResponsavelEmbalagem.value
                            || null,

                        p_entregador_id:
                            editarEntregador.value
                            || null,

                        p_observacao:
                            editarObservacao.value.trim()
                            || null
                    }
                );

            if (error) {
                throw error;
            }

            editarMessage.textContent =
                'Alterações salvas!';

            // Atualiza todas as áreas

            await carregarPecasDesenvolvimento();

            await carregarPecasEstoque();

            await carregarPecasEmbaladas();

            await carregarPecasEntregas();


            setTimeout(() => {

                modalEditarPeca.classList.add('hidden');

                formEditarPeca.reset();

                pecaSelecionadaEdicao = null;

            }, 800);

        } catch (error) {

            console.error(
                'Erro ao editar peça:',
                error
            );

            editarMessage.textContent =
                error.message ||
                'Erro ao salvar alterações.';

        } finally {

            botao.disabled = false;
        }
    }
);
  document.addEventListener(
    'click',
    (event) => {

        const botao =
            event.target.closest('.editar-peca-btn');

        if (!botao) return;

        abrirModalEdicao(
            botao.dataset.id
        );
    }
);
  // Abre o modal de funcionário
addFuncionarioBtn.addEventListener('click', () => {

    modalFuncionario.classList.remove('hidden');

    formFuncionario.reset();

    funcionarioMessage.textContent = '';

    funcionarioNomeInput.focus();
});


// Fecha o modal pelo X
fecharModalFuncionario.addEventListener('click', () => {

    modalFuncionario.classList.add('hidden');

    formFuncionario.reset();

    funcionarioMessage.textContent = '';
});


// Fecha clicando fora do modal
modalFuncionario.addEventListener('click', (event) => {

    if (event.target === modalFuncionario) {

        modalFuncionario.classList.add('hidden');

        formFuncionario.reset();

        funcionarioMessage.textContent = '';
    }
});
  formFuncionario.addEventListener('submit', async (event) => {

    event.preventDefault();

    const nome = funcionarioNomeInput.value.trim();
    const email = funcionarioEmailInput.value.trim();
    const senha = funcionarioSenhaInput.value;

    if (!nome || !email || !senha) {
        funcionarioMessage.textContent =
            'Preencha todos os campos.';
        return;
    }

    if (senha.length < 6) {
        funcionarioMessage.textContent =
            'A senha deve ter pelo menos 6 caracteres.';
        return;
    }

    funcionarioMessage.textContent =
        'Cadastrando funcionário...';

    const botaoSubmit = formFuncionario.querySelector(
        'button[type="submit"]'
    );

    botaoSubmit.disabled = true;

    try {

        const {
            data,
            error
        } = await supabaseClient.functions.invoke(
            'cadastrar-funcionario',
            {
                body: {
                    nome: nome,
                    email: email,
                    senha: senha
                }
            }
        );

        if (error) {
            throw error;
        }

        if (data?.erro) {
            throw new Error(data.erro);
        }

        funcionarioMessage.textContent =
            'Funcionário cadastrado com sucesso!';

        formFuncionario.reset();

        setTimeout(() => {

            modalFuncionario.classList.add('hidden');

            funcionarioMessage.textContent = '';

        }, 1000);

    } catch (error) {

        console.error(
            'Erro ao cadastrar funcionário:',
            error
        );

        funcionarioMessage.textContent =
            error.message ||
            'Erro ao cadastrar funcionário.';

    } finally {

        botaoSubmit.disabled = false;
    }
}); 
});