NewGlass

Sistema web para controle de peças, estoque e movimentação de entregas da NewGlass.

O projeto foi desenvolvido para centralizar o acompanhamento das peças desde o momento em que são cadastradas para desenvolvimento até sua saída para entrega, mantendo um histórico completo das movimentações realizadas.

🌐 Sistema: https://new-glass.vercel.app

---

📋 Sobre o projeto

O NewGlass é um sistema interno desenvolvido para facilitar o controle e a organização do fluxo de peças da empresa.

Cada peça possui informações próprias, como:

- Desenvolvedor responsável
- Sigla
- Modelo do carro
- Cliente
- Ordem de Serviço (OS)
- Código QR
- Observação
- Responsável pela inspeção
- Responsável pela liberação
- Status atual

Além das informações atuais, o sistema mantém um histórico de movimentações, permitindo acompanhar o que aconteceu com cada peça desde seu cadastro.

---

🔄 Fluxo da peça

O sistema acompanha a peça através das seguintes etapas:

- EM DESENVOLVIMENTO
-    NO ESTOQUE
-      EMBALADA
- AGUARDANDO SAÍDA
- SAIU PARA ENTREGA

Cada mudança importante é registrada no histórico da peça.

---

📦 Funcionalidades

Desenvolvimento

- Cadastro de novas peças
- Seleção do desenvolvedor responsável
- Seleção de sigla
- Modelo do carro
- Cliente
- Ordem de Serviço
- Código QR
- Observações
- Informações de inspeção e liberação

Estoque

- Visualização das peças disponíveis
- Conclusão do desenvolvimento
- Registro do responsável pela etapa

Embalagem

- Seleção do responsável pela embalagem
- Registro da data e horário
- Alteração automática do status da peça

Entregas

- Definição do entregador
- Registro da saída para entrega
- Controle das peças que aguardam saída
- Registro da data e horário da saída

Histórico

Cada peça possui um histórico próprio contendo:

- Evento realizado
- Responsável
- Data
- Horário
- Observações relacionadas ao evento

O histórico é mantido para preservar o acompanhamento da peça durante todo o processo.

Edição de peças

Peças cadastradas podem ser editadas através de um modal próprio, permitindo atualizar informações como:

- Desenvolvedor
- Cliente
- OS
- Código QR
- Observação
- Inspeção
- Liberação
- Responsáveis das etapas

Prontuário da peça

Ao clicar em uma peça, é possível abrir um modal com todas as informações relacionadas a ela.

O prontuário apresenta:

- Dados gerais
- Cliente
- Modelo
- OS
- Código QR
- Desenvolvedor
- Sigla
- Observação
- Inspeção
- Liberação
- Status atual
- Histórico completo da peça

O histórico é apresentado em formato de timeline, do evento mais antigo para o mais recente.

---

🔐 Autenticação

O sistema utiliza autenticação para controlar o acesso dos funcionários.

Cada funcionário possui seu próprio acesso, permitindo identificar o usuário responsável pelas operações realizadas no sistema.

---

🗄️ Banco de dados

O projeto utiliza Supabase como backend.

Entre as principais tabelas utilizadas estão:

funcionarios
siglas
pecas
historico_pecas
embalagens
saidas_entrega

O sistema também utiliza Row Level Security (RLS) para controlar o acesso aos dados.

---

⚙️ Tecnologias utilizadas

Front-end

- HTML5
- CSS3
- JavaScript
- Font Awesome

Back-end / Banco de dados

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase RPC
- Row Level Security (RLS)

Deploy

- Vercel

---

📁 Estrutura do projeto

Uma estrutura simplificada do projeto:

NewGlass/
│
├── index.html
├── painel.html
│
├── css/
│   └── painel.css
│
├── js/
│   └── painel.js
│
└── README.md

A estrutura pode variar conforme a organização atual do projeto.

---

🚀 Como executar

1. Clone o projeto

git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

2. Entre na pasta

cd NewGlass

3. Abra o projeto

Como o projeto utiliza HTML, CSS e JavaScript, ele pode ser executado utilizando um servidor local ou uma extensão como Live Server.

---

🔑 Configuração do Supabase

Para executar o sistema em outro ambiente, é necessário configurar o projeto Supabase utilizado pelo NewGlass.

A aplicação utiliza:

- Supabase URL
- Supabase Anon Key
- Supabase Auth
- Tabelas PostgreSQL
- Policies de RLS
- Funções RPC

As credenciais devem ser configuradas de acordo com o ambiente utilizado.

«Importante: nunca publique chaves privadas ou credenciais administrativas no código-fonte.»

---

📊 Status das peças

Status| Descrição
"EM_DESENVOLVIMENTO"| Peça ainda em desenvolvimento
"NO_ESTOQUE"| Desenvolvimento concluído e peça disponível
"EMBALADA"| Peça já foi embalada
"AGUARDANDO_SAIDA"| Peça possui entregador definido e aguarda saída
"SAIU_PARA_ENTREGA"| Peça já saiu para entrega

---

📝 Eventos registrados

O histórico utiliza eventos para registrar as principais movimentações:

CRIACAO
DESENVOLVIMENTO_CONCLUIDO
EMBALAGEM_REALIZADA
ENTREGADOR_DEFINIDO
SAIDA_PARA_ENTREGA

Esses registros permitem acompanhar a trajetória da peça sem apagar o histórico anterior.

---

🎯 Objetivo

O principal objetivo do NewGlass é organizar e centralizar o controle das peças, reduzindo a necessidade de controles manuais e facilitando a visualização do andamento de cada item.

Com o sistema, cada peça possui uma trajetória rastreável desde seu cadastro até sua saída para entrega.

---

🌐 Acesso

NewGlass:
https://new-glass.vercel.app

---

👨‍💻 Desenvolvimento

Projeto desenvolvido para a NewGlass, com foco em gerenciamento interno de peças, estoque e entregas.

---

📄 Licença

Este projeto é de uso interno da NewGlass.

A reprodução, distribuição ou utilização do sistema fora do ambiente autorizado deve ser realizada somente com permissão dos responsáveis pelo projeto.