
async function protegerPainel() {
    // Verifica se existe uma sessão ativa
    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        window.location.href = 'login.html';
        return;
    }

    // Verifica se o usuário pertence a um funcionário ativo
    const usuario = data.session.user;

    const { data: funcionario, error: funcionarioError } =
        await supabaseClient
            .from('funcionarios')
            .select('id, nome, ativo')
            .eq('usuario_id', usuario.id)
            .eq('ativo', true)
            .maybeSingle();

    if (funcionarioError || !funcionario) {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
        return;
    }

    // Disponibiliza o funcionário para os outros scripts
    window.funcionarioLogado = funcionario;
    document.dispatchEvent(new CustomEvent('funcionarioCarregado'));
}

protegerPainel();
