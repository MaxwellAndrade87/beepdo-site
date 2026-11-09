// Posts do blog do BeepDo (beepdo.app/blog).
// Para publicar um post novo: adicione um objeto no topo da lista e rode o gerar.js.
// Campos: slug (endereço), titulo, resumo (até ~160 caracteres, vira a descrição
// no Google), data (AAAA-MM-DD), categoria, leitura (minutos), capa (emoji + 2 cores)
// e corpo (HTML simples: <p>, <h2>, <ul>, <ol>, <blockquote>, <a>).
module.exports = [
  {
    slug: 'organizar-a-semana-no-domingo',
    titulo: 'Domingo à noite: 15 minutos para organizar a semana inteira',
    resumo: 'Uma revisão rápida no domingo evita a sensação de começar a segunda correndo atrás. Veja o roteiro de 15 minutos para planejar a semana.',
    data: '2026-09-26',
    categoria: 'Produtividade',
    leitura: 4,
    capa: { emoji: '🗓️', de: '#6D4AE0', para: '#3B6FE0' },
    corpo: `
<p>Tem gente que chega na segunda-feira já sentindo que está atrasada. Não porque a semana começou mal, mas porque ela começou sem mapa. Quinze minutos no domingo à noite resolvem boa parte disso.</p>

<h2>O roteiro dos 15 minutos</h2>
<h3>1. Olhe para trás (3 minutos)</h3>
<p>O que ficou pendente da semana passada? Conclua o que já foi feito e não foi marcado, e decida o destino do resto: nova data, outra pessoa ou lixeira.</p>
<h3>2. Veja os compromissos fixos (3 minutos)</h3>
<p>Reuniões, consultas, aulas, aniversários, contas que vencem. Tudo o que tem dia e hora marcados entra primeiro, com alarme quando precisar.</p>
<h3>3. Escolha as 3 metas da semana (4 minutos)</h3>
<p>Se a semana só permitisse três entregas, quais seriam? Distribua essas três ao longo dos dias, em vez de deixar todas para sexta.</p>
<h3>4. Prepare a segunda-feira (5 minutos)</h3>
<p>Defina as primeiras tarefas de segunda, de manhã. Começar a semana sabendo exatamente o que fazer primeiro tira muito da ansiedade de domingo à noite.</p>

<h2>Por que funciona</h2>
<p>Planejar a semana transforma uma pilha de preocupações soltas em um calendário. Você para de pensar "tenho muita coisa" e passa a pensar "terça eu faço isso, quinta aquilo". A cabeça descansa melhor quando sabe que tudo tem lugar.</p>

<h2>No BeepDo</h2>
<ul>
  <li>Crie uma tarefa recorrente <strong>"Planejar a semana"</strong> todo domingo, às 20h, com alarme. O hábito vira automático.</li>
  <li>No <strong>Mural de Pendências</strong>, veja em um lugar só o que atrasou, o que é de hoje e o que vem depois.</li>
  <li>Arraste o que não coube para outro dia, em um toque.</li>
</ul>
<blockquote>Uma semana planejada não fica menos cheia. Fica menos confusa.</blockquote>
`,
  },
  {
    slug: 'trabalho-e-vida-pessoal-na-mesma-lista',
    titulo: 'Trabalho e vida pessoal na mesma lista: como separar sem se perder',
    resumo: 'Relatório, mercado, reunião e consulta do filho disputam o mesmo espaço na cabeça. Veja como organizar tudo junto, mas sem misturar.',
    data: '2026-09-26',
    categoria: 'Dia a dia',
    leitura: 4,
    capa: { emoji: '⚖️', de: '#1F9D63', para: '#6D4AE0' },
    corpo: `
<p>A vida não se divide em dois celulares. As tarefas do trabalho e as de casa chegam ao mesmo tempo: você está fechando uma planilha e lembra que o gás está acabando; está no mercado e chega uma mensagem do chefe. Ter duas listas separadas parece organizado, mas costuma virar duas listas esquecidas.</p>

<h2>Uma lista, várias áreas</h2>
<p>O que funciona melhor para a maioria das pessoas é ter <strong>um lugar só</strong>, dividido por áreas. Assim você vê o dia inteiro de uma vez, mas sabe de onde cada coisa vem.</p>
<ul>
  <li><strong>Trabalho:</strong> entregas, reuniões, retornos.</li>
  <li><strong>Casa:</strong> contas, compras, manutenção.</li>
  <li><strong>Família:</strong> escola, consultas, aniversários.</li>
  <li><strong>Pessoal:</strong> estudo, treino, projetos seus.</li>
</ul>

<h2>Três regras que evitam a bagunça</h2>
<ol>
  <li><strong>Horário realista para cada área.</strong> Tarefa de casa com horário no meio do expediente tende a ficar para depois. Coloque onde você realmente consegue fazer.</li>
  <li><strong>Fim do expediente é fim da lista do trabalho.</strong> O que sobrou vai para amanhã, com data. Não fica "rodando" na cabeça à noite.</li>
  <li><strong>Revise tudo junto, uma vez por dia.</strong> Dois minutos de manhã para ver o dia inteiro, trabalho e casa.</li>
</ol>

<h2>No BeepDo</h2>
<ul>
  <li>Crie um <strong>projeto para cada área</strong>, com ícone e cor próprios. As tarefas mostram de qual projeto vieram.</li>
  <li>O <strong>Dashboard</strong> mostra o dia completo; o projeto mostra só aquela área quando você quer foco.</li>
  <li>Use o <strong>widget</strong> na tela inicial para ver o que vem a seguir, seja do trabalho ou de casa.</li>
</ul>
<blockquote>Separar por áreas não é dividir a vida em duas. É saber onde cada coisa mora.</blockquote>
`,
  },
  {
    slug: 'whatsapp-do-trabalho-fora-do-horario',
    titulo: 'WhatsApp do trabalho fora do horário: como não perder pedidos (nem a sua noite)',
    resumo: 'O pedido chega às 22h pelo WhatsApp e some no meio das conversas. Veja como registrar sem virar refém da mensagem e sem deixar nada escapar.',
    data: '2026-09-26',
    categoria: 'Trabalho',
    leitura: 5,
    capa: { emoji: '💬', de: '#1F9D63', para: '#3DB8A8' },
    corpo: `
<p>O WhatsApp virou canal oficial de trabalho em muitas empresas. É rápido e prático, mas tem dois efeitos colaterais: os pedidos chegam a qualquer hora e se perdem facilmente no meio de grupos, áudios e figurinhas. Quantas vezes um "me manda aquilo amanhã" ficou enterrado na conversa?</p>

<h2>O problema não é a mensagem, é onde ela fica</h2>
<p>Conversa não é lista de tarefas. Ela rola, some para baixo e mistura assuntos. Se o pedido ficar só no WhatsApp, você depende de lembrar de voltar lá, no momento certo, e achar a mensagem.</p>

<h2>Um jeito simples de lidar</h2>
<ol>
  <li><strong>Transforme em tarefa na hora.</strong> Leu um pedido? Anote em segundos, com a data em que vai fazer. Não precisa resolver agora, só registrar.</li>
  <li><strong>Responda com prazo.</strong> "Anotado, te retorno amanhã às 10h" é melhor do que um "ok" solto. Você alinha a expectativa e se compromete com uma data possível.</li>
  <li><strong>Fora do horário, registre e desligue.</strong> Chegou às 22h? Anote para o dia seguinte e deixe o celular de lado. A tarefa já está segura, não precisa ficar pensando nela.</li>
  <li><strong>Revise antes de começar o dia.</strong> O que foi anotado na noite anterior aparece na sua lista de manhã, junto com o resto.</li>
</ol>

<h2>No BeepDo</h2>
<ul>
  <li>Toque no <strong>+</strong> e anote o pedido com data e horário em poucos segundos.</li>
  <li>Coloque um <strong>alarme</strong> para o horário do retorno que você prometeu.</li>
  <li>De manhã, o <strong>Dashboard</strong> mostra tudo o que chegou fora do horário, pronto para ser feito.</li>
</ul>
<blockquote>Registrar é o que permite desligar. O que está anotado não precisa ficar na cabeça.</blockquote>
<p>Se as mensagens fora do horário forem frequentes, vale conversar com a equipe sobre combinados de horário. Organização pessoal ajuda, mas limites claros ajudam todo mundo.</p>
`,
  },
  {
    slug: 'como-dizer-nao-sem-culpa-no-trabalho',
    titulo: 'Como dizer "não" (ou "agora não") sem culpa no trabalho',
    resumo: 'Aceitar tudo parece colaborativo, até os prazos começarem a estourar. Veja como negociar prioridades com respeito e proteger o que já foi prometido.',
    data: '2026-09-26',
    categoria: 'Trabalho',
    leitura: 5,
    capa: { emoji: '✋', de: '#E0564A', para: '#E05AA8' },
    corpo: `
<p>"Consegue ver isso pra mim rapidinho?" A resposta automática de muita gente é sim. O problema é que cada sim é um pedaço do seu tempo que sai de outro lugar, e esse outro lugar costuma ser um prazo que você já tinha assumido.</p>

<h2>Dizer não é proteger um sim</h2>
<p>Quando você aceita algo novo sem olhar a lista, está, sem perceber, dizendo "não" para alguma coisa que já estava lá. A diferença é que esse "não" aparece depois, em forma de atraso. Ser claro na hora é mais honesto com todo mundo.</p>

<h2>Frases que ajudam</h2>
<ul>
  <li><strong>"Consigo sim, mas só na quinta. Serve?"</strong>: você aceita, mas com uma data que cabe.</li>
  <li><strong>"Hoje estou com X e Y. Qual desses pode esperar para eu pegar o seu?"</strong>: você devolve a decisão de prioridade para quem pediu.</li>
  <li><strong>"Não consigo agora, mas posso te indicar quem sabe."</strong>: você ajuda sem assumir.</li>
  <li><strong>"Me manda por escrito que eu te dou um prazo."</strong>: você ganha tempo para olhar a lista antes de responder.</li>
</ul>

<h2>Olhe a lista antes de responder</h2>
<p>Fica muito mais fácil negociar quando você sabe exatamente o que já tem na semana. "Estou cheio" é vago. "Tenho três entregas até quinta" é concreto e costuma ser bem recebido.</p>

<h2>No BeepDo</h2>
<ul>
  <li>Abra o <strong>Mural de Pendências</strong> antes de aceitar algo novo e veja quanto já tem para hoje e para os próximos dias.</li>
  <li>Se aceitar, anote na hora com a data combinada e, se precisar, um <strong>aviso antecipado</strong>.</li>
  <li>Se algo precisar sair da frente, <strong>arraste para outro dia</strong> e avise quem estiver esperando.</li>
</ul>
<blockquote>Um "agora não" bem explicado vale mais do que um "sim" que atrasa.</blockquote>
`,
  },
  {
    slug: 'rotina-de-quem-trabalha-por-turno',
    titulo: 'Rotina de quem trabalha por turno: como se organizar quando cada semana é diferente',
    resumo: 'Folga no meio da semana, turno da noite, escala que muda. Veja como organizar contas, compromissos e descanso quando a rotina não é de segunda a sexta.',
    data: '2026-09-26',
    categoria: 'Dia a dia',
    leitura: 5,
    capa: { emoji: '🌙', de: '#3B3F8F', para: '#6D4AE0' },
    corpo: `
<p>Indústria, saúde, segurança, comércio, transporte: muita gente trabalha em escala, turno ou revezamento. Nessa rotina, "segunda-feira" nem sempre é dia de trabalho, e o sábado pode ser o dia mais cheio. Os métodos de organização pensados para o horário comercial nem sempre encaixam.</p>

<h2>O desafio</h2>
<ul>
  <li>O horário de acordar e dormir muda de semana para semana.</li>
  <li>Compromissos pessoais (banco, médico, escola) funcionam no horário comercial, que às vezes é o seu horário de descanso.</li>
  <li>É fácil perder a noção do dia da semana, e com ela, os prazos.</li>
</ul>

<h2>O que ajuda</h2>
<ol>
  <li><strong>Organize pela sua escala, não pelo calendário comum.</strong> Anote as tarefas pessoais nos dias de folga e nos intervalos reais, não em "segunda de manhã".</li>
  <li><strong>Use recorrências por intervalo.</strong> Se a sua escala se repete a cada N dias, as tarefas ligadas a ela também podem se repetir assim.</li>
  <li><strong>Alarme para o que depende de horário comercial.</strong> Ligar para o banco, marcar consulta, resolver documento: coloque alarme no horário em que você estará acordado e disponível.</li>
  <li><strong>Proteja o descanso.</strong> Evite agendar tarefas logo depois de um turno da noite. Descansar também é compromisso.</li>
</ol>

<h2>No BeepDo</h2>
<ul>
  <li>Crie tarefas que se repetem <strong>a cada N dias</strong>, acompanhando o ritmo da sua escala.</li>
  <li>Os <strong>alarmes</strong> tocam no horário certo mesmo sem internet, inclusive de madrugada, se você precisar.</li>
  <li>O <strong>widget Hoje</strong> mostra o que é para hoje assim que você pega o celular, qualquer que seja o seu "hoje".</li>
</ul>
<blockquote>Rotina diferente não significa rotina desorganizada. Significa um sistema que se adapta a você.</blockquote>
`,
  },
  {
    slug: 'muita-tarefa-pouco-tempo-prazos-perdidos',
    titulo: 'Muita tarefa, pouco tempo: por que estamos perdendo prazos (e não é preguiça)',
    resumo: 'O trabalho pede cada vez mais, as demandas chegam por todos os lados e os prazos escapam. Entenda o que está acontecendo e o que dá pra mudar já.',
    data: '2026-09-26',
    categoria: 'Trabalho',
    leitura: 6,
    capa: { emoji: '🗂️', de: '#E0564A', para: '#E08A2E' },
    corpo: `
<p>Segunda-feira, 9h. Você abre o computador com três coisas em mente para fazer. Às 9h15 já chegaram duas mensagens no WhatsApp do trabalho, um e-mail "urgente", um convite para reunião e um pedido do colega que "leva só cinco minutinhos". No fim do dia, as três coisas que você tinha planejado continuam lá. E o prazo de uma delas era hoje.</p>
<p>Se isso soa familiar, você não está sozinho. E, quase sempre, <strong>não é falta de esforço</strong>.</p>

<h2>O trabalho mudou, a cabeça não</h2>
<p>Há alguns anos, as demandas chegavam por poucos canais e em horários mais previsíveis. Hoje elas chegam por mensagem, e-mail, sistema, grupo, ligação e corredor, a qualquer hora. Cada pessoa acumula funções que antes eram de duas ou três. E a expectativa de resposta rápida virou regra.</p>
<p>O resultado é uma lista de tarefas que cresce mais rápido do que a gente consegue executar, e que fica espalhada em vários lugares: um pouco no caderno, um pouco no WhatsApp, um pouco "na cabeça". É justamente aí que os prazos se perdem.</p>

<h2>Por que os prazos escapam</h2>
<ul>
  <li><strong>A memória não foi feita para ser agenda.</strong> Guardar dezenas de pendências de cabeça cansa e falha, principalmente nos dias mais cheios.</li>
  <li><strong>O urgente atropela o importante.</strong> Quem grita mais alto ganha a vez; o prazo que não "grita" só aparece quando já venceu.</li>
  <li><strong>Interrupções custam caro.</strong> Cada vez que você para uma tarefa para atender outra, a retomada leva tempo e energia.</li>
  <li><strong>Tudo parece ter o mesmo tamanho.</strong> Sem prioridade clara, o dia vai embora nas pequenas coisas.</li>
</ul>

<h2>O que dá para mudar já</h2>
<p>Não existe fórmula mágica, mas alguns hábitos simples fazem uma diferença enorme:</p>
<ol>
  <li><strong>Um lugar só para as tarefas.</strong> Chegou um pedido? Anote no mesmo lugar, na hora, com data. Se ficar na conversa do WhatsApp, vai se perder.</li>
  <li><strong>Prazo com aviso antes.</strong> Um lembrete no dia da entrega é tarde demais para quem precisa de tempo para fazer. Coloque um aviso dias ou horas antes.</li>
  <li><strong>Três prioridades por dia.</strong> Escolha logo cedo as três coisas que, se feitas, fazem o dia valer a pena. O resto encaixa em volta.</li>
  <li><strong>Blocos sem interrupção.</strong> Reserve pelo menos um período do dia para trabalhar com as notificações em silêncio.</li>
  <li><strong>Diga quando, não só sim.</strong> Em vez de "pode deixar", responda "consigo entregar na quinta". Isso protege a sua agenda e alinha expectativas.</li>
</ol>

<h2>Onde o BeepDo entra</h2>
<p>O BeepDo nasceu exatamente dessa rotina corrida. A ideia é simples: <strong>tirar as tarefas da cabeça e fazer o celular lembrar por você, na hora certa</strong>.</p>
<ul>
  <li>Anote em segundos, com data e horário, pelo botão "+" ou pelo widget na tela inicial.</li>
  <li>Configure um <strong>aviso antecipado</strong> para os prazos: dias ou horas antes, para dar tempo de fazer.</li>
  <li>Use o <strong>alarme</strong> para o que não pode passar. Ele toca mesmo sem internet.</li>
  <li>Abra o Dashboard de manhã e veja, em um só lugar, o que é pra hoje e o que atrasou.</li>
</ul>
<blockquote>Você não precisa dar conta de lembrar de tudo. Precisa de um sistema que lembre por você.</blockquote>
<p>Comece hoje com uma coisa só: anote o próximo prazo importante, coloque um aviso dois dias antes e deixe o celular cuidar do resto.</p>
`,
  },
  {
    slug: 'carga-mental-o-peso-invisivel',
    titulo: 'Carga mental: o peso invisível de ter que lembrar de tudo',
    resumo: 'Conta pra pagar, reunião, mercado, consulta do filho, aniversário da mãe. Lembrar de tudo cansa tanto quanto fazer. Veja como aliviar esse peso.',
    data: '2026-09-26',
    categoria: 'Dia a dia',
    leitura: 5,
    capa: { emoji: '🧠', de: '#8B5CF6', para: '#E05AA8' },
    corpo: `
<p>Tem um tipo de cansaço que não aparece na agenda. É o de <strong>ficar lembrando</strong>: que a conta de luz vence dia 10, que precisa comprar o presente da sobrinha, que o relatório é pra sexta, que falta gás, que a vacina do cachorro está atrasada. Esse "fica na cabeça" tem nome: carga mental.</p>

<h2>Por que ela pesa tanto</h2>
<p>O problema não é só a quantidade de coisas. É que cada uma delas fica "aberta" na sua mente, disputando atenção com o que você está fazendo agora. Você está numa reunião e lembra do boleto. Está jantando e lembra do e-mail que não respondeu. Está deitando para dormir e lembra de tudo ao mesmo tempo.</p>
<p>Quem mistura trabalho, casa e família sente isso em dobro, porque as listas se somam e não existe hora de "desligar".</p>

<h2>Três passos para aliviar</h2>
<h3>1. Esvazie a cabeça</h3>
<p>Separe dez minutos e escreva <em>tudo</em> o que está pendente, grande ou pequeno, de trabalho ou de casa. Não organize ainda, só tire da cabeça. Muita gente sente alívio só com esse passo.</p>
<h3>2. Dê um "quando" para cada coisa</h3>
<p>Uma tarefa sem data volta para a cabeça toda hora, pedindo para ser lembrada. Quando ela tem dia e, se precisar, horário, a sua mente pode soltar: ela sabe que vai ser avisada.</p>
<h3>3. Automatize o que se repete</h3>
<p>Boa parte da carga mental é repetição: contas todo mês, remédio todo dia, lixo toda quinta. Isso não precisa ser lembrado por uma pessoa. Precisa ser lembrado por um sistema.</p>

<h2>Como o BeepDo ajuda</h2>
<ul>
  <li><strong>Tudo num lugar só:</strong> trabalho, casa e família, separados por projetos se você quiser.</li>
  <li><strong>Tarefas recorrentes:</strong> cadastre uma vez e a próxima aparece sozinha quando você concluir.</li>
  <li><strong>Alarme e aviso antecipado:</strong> o celular lembra na hora certa, então você não precisa ficar lembrando.</li>
  <li><strong>Widget na tela inicial:</strong> uma olhada ao desbloquear o celular e você sabe o que é pra hoje.</li>
</ul>
<blockquote>Anotar não é sinal de memória fraca. É liberar a cabeça para o que realmente importa.</blockquote>
<p>Carga mental não some de uma vez, mas diminui muito quando você para de usar a própria memória como agenda. Comece esvaziando a cabeça hoje à noite: dez minutos, uma lista, e datas para o que importa.</p>
`,
  },
  {
    slug: 'tudo-atrasado-como-recuperar-o-controle',
    titulo: 'Tudo atrasado? Um plano de 5 passos para recuperar o controle',
    resumo: 'Quando as pendências se acumulam, dá vontade de fugir da lista. Veja um plano prático para sair do atraso sem se afogar, passo a passo.',
    data: '2026-09-25',
    categoria: 'Produtividade',
    leitura: 6,
    capa: { emoji: '🧭', de: '#1F9D63', para: '#3B6FE0' },
    corpo: `
<p>Tem semana que foge do controle. Um imprevisto, um projeto que cresceu, alguns dias doente, e de repente a lista tem mais atrasos do que tarefas em dia. Nessa hora, a tendência é evitar olhar para ela. E quanto menos a gente olha, maior ela fica.</p>
<p>A boa notícia: dá para sair do atraso com método. Aqui vai um plano em cinco passos.</p>

<h2>1. Encare a lista inteira (uma vez)</h2>
<p>Reúna tudo o que está pendente num lugar só: e-mails sem resposta, pedidos no WhatsApp, anotações soltas. Não tente resolver nada ainda. O objetivo é enxergar o tamanho real do problema, que costuma ser menor do que a ansiedade diz.</p>

<h2>2. Faça a triagem</h2>
<p>Para cada item, escolha um destino:</p>
<ul>
  <li><strong>Fazer:</strong> importante e com prazo próximo.</li>
  <li><strong>Agendar:</strong> importante, mas pode ter uma nova data realista.</li>
  <li><strong>Delegar ou pedir ajuda:</strong> outra pessoa pode fazer.</li>
  <li><strong>Descartar:</strong> perdeu o sentido. Apagar também é decidir.</li>
</ul>

<h2>3. Renegocie prazos com antecedência</h2>
<p>Se não vai dar tempo, avise <em>antes</em> de vencer, com uma nova data que você consiga cumprir. Na maioria dos ambientes de trabalho, um aviso honesto é muito melhor recebido do que um silêncio seguido de atraso.</p>

<h2>4. Três por dia, sem heroísmo</h2>
<p>Não tente zerar tudo num dia. Escolha as três tarefas mais importantes de cada dia e proteja o tempo para elas. Constância vence maratona.</p>

<h2>5. Revise todo dia, por dois minutos</h2>
<p>O atraso volta quando a lista fica esquecida. Dois minutos pela manhã, olhando o que é para hoje e o que atrasou, evitam que a bola de neve se forme de novo.</p>

<h2>Fazendo isso no BeepDo</h2>
<ul>
  <li>O <strong>Mural de Pendências</strong> separa o que está <em>atrasado</em>, o que é de <em>hoje</em> e o que vem depois. Toque em "Atrasadas" para ver só o que precisa de atenção.</li>
  <li>Arraste uma tarefa para o lado para jogar para amanhã ou escolher outro dia, em um toque.</li>
  <li>O card <strong>Hoje</strong> do Dashboard mostra quantas faltam e só comemora quando não sobrar nada atrasado.</li>
  <li>Coloque alarme nas três prioridades do dia. O resto fica na lista, sem barulho.</li>
</ul>
<blockquote>Sair do atraso não é fazer tudo de uma vez. É voltar a decidir o que vem primeiro.</blockquote>
<p>E se a sobrecarga estiver constante, semana após semana, vale conversar com quem distribui as demandas. Organização ajuda muito, mas não resolve sozinha um volume de trabalho maior do que cabe no dia.</p>
`,
  },
  {
    slug: 'prazo-nao-e-o-dia-da-entrega',
    titulo: 'O prazo não é o dia da entrega: planeje de trás para frente',
    resumo: 'Lembrar do prazo no dia em que ele vence é o jeito mais comum de perdê-lo. Aprenda a planejar de trás para frente e a usar avisos antecipados.',
    data: '2026-09-24',
    categoria: 'Trabalho',
    leitura: 5,
    capa: { emoji: '📅', de: '#3B6FE0', para: '#6D4AE0' },
    corpo: `
<p>"O relatório é pra sexta." Muita gente anota exatamente isso: sexta-feira, relatório. E na sexta de manhã descobre que precisava de dados que dependem de outra pessoa, que ainda não mandou. O prazo estava certo; o lembrete é que chegou tarde.</p>

<h2>O erro mais comum</h2>
<p>Tratar o prazo como o dia de <em>fazer</em>, quando ele é o dia de <em>entregar</em>. Quase toda entrega tem etapas antes: juntar informações, esperar alguém, revisar, corrigir. Se o único lembrete é no dia final, não sobra tempo para nenhuma delas.</p>

<h2>Planeje de trás para frente</h2>
<p>Parta da data de entrega e vá voltando no calendário:</p>
<ol>
  <li><strong>Entrega:</strong> sexta, 17h.</li>
  <li><strong>Revisão final:</strong> quinta à tarde.</li>
  <li><strong>Versão completa pronta:</strong> quarta.</li>
  <li><strong>Informações de outras pessoas:</strong> pedir na segunda, cobrar na terça.</li>
</ol>
<p>Pronto: uma tarefa grande virou quatro pequenas, cada uma com a sua data. E você descobre logo na segunda se algo vai travar, com tempo para reagir.</p>

<h2>Dê folga para o imprevisto</h2>
<p>Sempre acontece alguma coisa: uma reunião extra, um problema urgente, um dia ruim. Planeje para terminar um pouco antes do prazo real. Se tudo correr bem, você entrega com calma. Se não correr, ainda dá tempo.</p>

<h2>Como fazer isso no BeepDo</h2>
<ul>
  <li>Crie um <strong>projeto</strong> para a entrega e coloque as etapas como tarefas, cada uma com a sua data.</li>
  <li>Na tarefa da entrega, ative um <strong>aviso antecipado</strong>: um ou dois dias antes, para não ser pego de surpresa.</li>
  <li>Segure o dedo sobre o projeto para ver o resumo: quantas etapas faltam e qual é o prazo.</li>
  <li>Use o <strong>alarme</strong> na etapa que depende de outra pessoa, para lembrar de cobrar na hora certa.</li>
</ul>
<blockquote>Quem cumpre prazo não é quem trabalha mais na véspera. É quem começa a lembrar antes.</blockquote>
<p>Pegue o próximo prazo importante da sua semana e faça o exercício agora: quais são as etapas, e quando cada uma precisa estar pronta? Anote, coloque os avisos e deixe o celular trabalhar por você.</p>
`,
  },
  {
    slug: 'nunca-mais-esquecer-tarefas',
    titulo: 'Como parar de esquecer tarefas: o método dos 3 avisos',
    resumo: 'Anotar não basta: o que faz uma tarefa acontecer é ser lembrado na hora certa. Veja como combinar aviso antecipado, alarme e revisão do dia.',
    data: '2026-09-26',
    categoria: 'Produtividade',
    leitura: 5,
    capa: { emoji: '⏰', de: '#6D4AE0', para: '#B25AE0' },
    corpo: `
<p>Quase todo mundo já passou por isso: a tarefa estava anotada, mas ninguém lembrou dela na hora. A conta venceu, o remédio do cachorro ficou pra depois, o e-mail importante não saiu. O problema raramente é falta de lista. É falta de <strong>aviso no momento certo</strong>.</p>
<p>Um jeito simples de resolver é pensar em três avisos para cada coisa que realmente importa.</p>

<h2>1. O aviso antecipado: pra se preparar</h2>
<p>Algumas tarefas precisam de preparo: separar documentos, sair mais cedo, comprar algo antes. Para essas, um aviso <em>antes</em> do horário vale ouro. Pode ser 30 minutos, algumas horas ou até um dia antes.</p>
<p>No BeepDo você escolhe quando o aviso antecipado toca. A tarefa continua marcada para o horário original; o aviso só te dá tempo de se organizar.</p>

<h2>2. O alarme na hora: pra fazer</h2>
<p>Notificação comum é fácil de ignorar. Quando a tarefa não pode passar, ela merece um alarme de verdade. No BeepDo, cada tarefa com horário pode tocar na hora certa, mesmo sem internet, porque tudo fica salvo no celular.</p>
<p>E se você ainda não puder fazer naquele momento? Use o <strong>Adiar</strong>: o aviso toca de novo mais tarde, mas o horário da tarefa não muda. Assim a sua agenda não vira uma bagunça de horários remarcados.</p>

<h2>3. A revisão do dia: pra não acumular</h2>
<p>O terceiro aviso é seu com você mesmo: uma olhada rápida no começo do dia. Dois minutos bastam para ver o que é pra hoje, o que atrasou e o que vem nos próximos dias.</p>
<ul>
  <li>Abra o <strong>Dashboard</strong> e veja o card <em>Hoje</em>: quantas tarefas faltam e se tem algo atrasado.</li>
  <li>O que atrasou, resolva ou arraste para outro dia. Deixar atrasada "pra ver depois" é o que faz a lista perder a credibilidade.</li>
  <li>Se preferir nem abrir o app, deixe o <strong>widget Hoje</strong> na tela inicial.</li>
</ul>

<h2>Quando usar cada um</h2>
<p>Nem toda tarefa precisa dos três. Uma regra prática:</p>
<ul>
  <li><strong>Coisas com hora marcada</strong> (consulta, reunião, buscar alguém): aviso antecipado + alarme.</li>
  <li><strong>Coisas com prazo</strong> (pagar conta, entregar algo): alarme no dia, de manhã.</li>
  <li><strong>Coisas sem pressa</strong>: sem alarme, só na lista. Elas aparecem na revisão do dia.</li>
</ul>
<blockquote>Lembrete bom é aquele que aparece quando dá pra agir, e não um minuto depois.</blockquote>
<p>Comece pelas três tarefas que mais te fazem falta quando esquecidas. Coloque horário e alarme nelas hoje. Em uma semana você sente a diferença.</p>
`,
  },
  {
    slug: 'tarefas-recorrentes-rotina-no-automatico',
    titulo: 'Tarefas recorrentes: coloque a rotina no automático',
    resumo: 'Contas, remédios, faxina, relatórios: o que se repete não precisa ser anotado toda semana. Aprenda a criar tarefas recorrentes que se renovam sozinhas.',
    data: '2026-09-24',
    categoria: 'Dia a dia',
    leitura: 4,
    capa: { emoji: '🔁', de: '#1F9D63', para: '#3DB8A8' },
    corpo: `
<p>Boa parte do que a gente precisa lembrar não é novidade: é repetição. A conta de luz todo mês, o lixo reciclável toda quinta, a planilha toda sexta, a água das plantas a cada três dias. Anotar tudo isso de novo, toda vez, cansa. E o cansaço é o que faz a gente parar de anotar.</p>

<h2>Anote uma vez, receba sempre</h2>
<p>Uma tarefa recorrente é criada uma vez só. Quando você conclui, a próxima já nasce com a nova data, no mesmo horário e com o mesmo alarme. Nada de recriar, nada de esquecer.</p>
<p>No BeepDo, ao criar ou editar uma tarefa, ative <strong>Repetir</strong> e escolha como:</p>
<ul>
  <li><strong>Em dias da semana</strong>: segunda, quarta e sexta, por exemplo.</li>
  <li><strong>A cada N dias</strong>: a cada 2, 3, 15 dias.</li>
  <li><strong>Por regras</strong> (Premium): combinações mais específicas para rotinas mais elaboradas.</li>
</ul>

<h2>Ideias de recorrências que salvam o dia</h2>
<ul>
  <li><strong>Casa:</strong> trocar a roupa de cama (a cada 7 dias), limpar o filtro do ar (a cada 30 dias), regar as plantas (a cada 3 dias).</li>
  <li><strong>Dinheiro:</strong> conferir a fatura do cartão, pagar o aluguel, separar a reserva do mês.</li>
  <li><strong>Trabalho:</strong> relatório semanal, reunião de alinhamento, backup dos arquivos.</li>
  <li><strong>Cuidados:</strong> vacina e vermífugo do pet, revisão do carro, troca da escova de dentes.</li>
</ul>

<h2>Três cuidados para não virar ruído</h2>
<ol>
  <li><strong>Horário realista.</strong> Coloque a recorrência no momento em que você de fato consegue fazer, não no ideal.</li>
  <li><strong>Pule sem culpa.</strong> Não deu hoje? Conclua quando fizer ou arraste para amanhã. A próxima ocorrência continua no ritmo certo.</li>
  <li><strong>Revise de vez em quando.</strong> Se uma recorrência vive atrasada, talvez o intervalo esteja errado. Ajuste.</li>
</ol>
<p>Rotina no automático não é rigidez: é tirar da cabeça o que o celular pode lembrar por você. Sobra espaço para o que precisa mesmo de atenção.</p>
`,
  },
  {
    slug: 'widgets-na-tela-inicial',
    titulo: 'Widgets na tela inicial: veja o seu dia sem abrir o app',
    resumo: 'O lugar mais visto do celular é a tela inicial. Veja como usar os widgets do BeepDo para acompanhar e concluir tarefas em um toque.',
    data: '2026-09-22',
    categoria: 'Dicas do app',
    leitura: 3,
    capa: { emoji: '📱', de: '#E08A2E', para: '#E0B84A' },
    corpo: `
<p>Você desbloqueia o celular dezenas de vezes por dia. Cada uma dessas vezes pode ser um lembrete gratuito do que precisa ser feito, sem abrir app nenhum. É pra isso que servem os widgets.</p>

<h2>Widget Hoje</h2>
<p>Mostra a <strong>próxima tarefa em destaque</strong> e o resto do seu dia logo abaixo. Dá pra concluir direto do widget: toque no círculo e pronto. É gratuito e funciona para todo mundo.</p>

<h2>Widget de Projeto (Premium)</h2>
<p>Para quem organiza as coisas por projeto: mostra o progresso e as tarefas de um projeto específico, como uma reforma, uma viagem ou um trabalho da faculdade. Você escolhe qual projeto aparece e ainda pode ajustar a opacidade para combinar com o papel de parede.</p>

<h2>Como adicionar</h2>
<ol>
  <li>Toque e segure num espaço vazio da tela inicial.</li>
  <li>Escolha <strong>Widgets</strong> e procure por <strong>BeepDo</strong>.</li>
  <li>Arraste o widget para onde quiser e ajuste o tamanho.</li>
</ol>
<p>Em alguns celulares o caminho muda um pouco (por exemplo, "Adicionar à tela inicial"), mas a ideia é a mesma.</p>

<h2>Dica de ouro</h2>
<p>Coloque o widget na <strong>primeira página</strong> da tela inicial, perto dos apps que você mais usa. Um widget escondido na terceira tela vira decoração.</p>
<blockquote>O melhor sistema de tarefas é aquele que você vê sem precisar procurar.</blockquote>
`,
  },
  {
    slug: 'projetos-metas-grandes-em-passos-pequenos',
    titulo: 'Projetos: transforme metas grandes em passos pequenos',
    resumo: 'Reforma, viagem, mudança, TCC: metas grandes travam porque parecem uma tarefa só. Veja como quebrar em passos pequenos e acompanhar o progresso.',
    data: '2026-09-20',
    categoria: 'Produtividade',
    leitura: 5,
    capa: { emoji: '🎯', de: '#3B6FE0', para: '#6D4AE0' },
    corpo: `
<p>"Organizar a mudança" não é uma tarefa. É um projeto com dezenas de tarefas dentro. Quando a gente anota a meta inteira como se fosse uma coisa só, ela fica grande demais para começar, e aí vai sendo empurrada.</p>

<h2>Passo 1: dê um nome e um prazo</h2>
<p>Crie um projeto com um nome claro ("Mudança de apartamento"), escolha um ícone e uma cor, e, se houver, coloque o prazo final. Só isso já tira a meta da cabeça e coloca num lugar visível.</p>

<h2>Passo 2: quebre até ficar óbvio</h2>
<p>Uma boa tarefa é aquela que você sabe exatamente como começar. Se ao ler você pensa "tá, mas o que eu faço primeiro?", ela ainda está grande.</p>
<ul>
  <li>❌ "Resolver a internet da casa nova"</li>
  <li>✅ "Ligar para a operadora e agendar a instalação"</li>
  <li>✅ "Conferir se o roteador antigo funciona com o novo plano"</li>
</ul>

<h2>Passo 3: só algumas tarefas com data</h2>
<p>Não precisa datar tudo. Coloque data e horário nas próximas 2 ou 3 tarefas e deixe o resto sem data. Conforme você avança, vai puxando as próximas. Assim o projeto não enche seu dia de atrasos falsos.</p>

<h2>Passo 4: acompanhe o progresso</h2>
<p>No BeepDo, cada projeto mostra quantas tarefas estão abertas e concluídas, e as abertas ficam organizadas por data e hora. Segurando o dedo sobre o projeto, você vê a descrição e o resumo sem precisar abrir.</p>
<p>Ver a barra de progresso andar é um dos melhores motivadores que existem. Vale até concluir tarefas bem pequenas só pra sentir o avanço.</p>

<h2>Exemplos de projetos</h2>
<ul>
  <li><strong>Viagem:</strong> passagens, hospedagem, documentos, roteiro, malas.</li>
  <li><strong>Reforma:</strong> orçamentos, compra de material, agenda do pedreiro, limpeza.</li>
  <li><strong>Estudos:</strong> capítulos, exercícios, revisão, entrega.</li>
  <li><strong>Saúde e bem-estar:</strong> consultas, exames, rotina de treinos.</li>
</ul>
<p>No plano grátis você tem até 3 projetos ativos; no Premium, projetos ilimitados. Comece pelo que mais está te tirando o sono.</p>
`,
  },
];
