
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    loginMessage.textContent = 'Entrando...';

    try {
        // Faz o login pelo Supabase Auth
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {
            throw error;
        }

        const usuario = data.user;

        // Verifica se o usuário está vinculado a um funcionário ativo
        const { data: funcionario, error: funcionarioError } =
            await supabaseClient
                .from('funcionarios')
                .select('id, nome, ativo')
                .eq('usuario_id', usuario.id)
                .eq('ativo', true)
                .maybeSingle();

        if (funcionarioError) {
            throw funcionarioError;
        }

        // Impede o acesso de usuários sem vínculo com um funcionário
        if (!funcionario) {
            await supabaseClient.auth.signOut();

            loginMessage.textContent =
                'Acesso não autorizado para este sistema.';

            return;
        }

        loginMessage.textContent = 'Login realizado!';

        // Redireciona para o painel
        window.location.href = 'painel.html';

    } catch (error) {
        console.error('Erro no login:', error);

        loginMessage.textContent =
            'E-mail ou senha incorretos.';
    }
});
