import React, { useEffect } from 'react';
import StepCard from '../components/StepCard';
import MachineFriendChat from '../components/MachineFriendChat';
import FriendMachineImage from '../images/friend-machine.png';

const steps = [
  {
    number: 1,
    title: 'Desembalando e Verificando',
    description:
      'Abra a caixa com cuidado e certifique-se de que todos os itens estao presentes: Machine Pay, chicote de instalacao, adesivo Pix, QR Code Pix, maquininha de cartao e carregador.',
  },
  {
    number: 2,
    title: 'Conexao do Chicote',
    description:
      'Se vier com chicote, retire o chicote original do moedeiro ou noteiro, conecte o original no femea da Machine Pay e o macho da Machine Pay no lugar onde ficava o original.',
  },
  {
    number: 3,
    title: 'Fiacao dos Cabos',
    description:
      'Se vier sem chicote, conecte energia, terra e coin de forma coerente: Machine Pay vermelho energia, preto terra e branco coin. No moedeiro ou noteiro, normalmente amarelo e energia, azul ou branco e coin, preto ou roxo e terra.',
  },
  {
    number: 4,
    title: 'Chaves do Moedeiro',
    description:
      'Verifique as tres alavancas do moedeiro: a de cima toda para cima, a do meio equilibrada no centro e a de baixo toda para baixo.',
  },
  {
    number: 5,
    title: 'Wi-Fi e ID',
    description:
      'Entre no Wi-Fi Machine Pay pelo celular. Se a rede nao aparecer, aperte 7 vezes o botao escondido na caixinha para resetar. Use a senha 01012024 ou 01012023, crie sua senha em Opcoes / Senha e depois configure rede, velocidades, quantidade, valor e ID do caixa.',
  },
  {
    number: 6,
    title: 'Maquininha de Cartao',
    description:
      'Abra o app Mercado Pago da conta configurada, leia o QR Code da maquininha, escolha o caixa criado na Machine Pay, confirme loja e caixa, crie a senha de seguranca e finalize.',
  },
];

const Manual = () => {
  useEffect(() => {
    if (window.location.hash !== '#machinefriend') return;

    requestAnimationFrame(() => {
      document.getElementById('machinefriend')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-r from-orange-500 to-purple-600 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <MachineFriendChat />

          <aside className="flex items-start justify-center gap-4 lg:sticky lg:top-24 lg:flex-col lg:items-end">
            <div className="relative max-w-[220px] rounded-lg bg-white px-4 py-3 text-xs font-semibold leading-snug text-gray-800 shadow-xl">
              <span className="absolute -right-2 top-8 hidden h-4 w-4 rotate-45 bg-white lg:block" />
              Olá! Me chamo Mario, estou aqui para ajudá-lo!
            </div>
            <img
              src={FriendMachineImage}
              alt="Avatar do assistente virtual Mario"
              className="h-40 w-40 shrink-0 object-contain drop-shadow-2xl sm:h-52 sm:w-52 lg:h-72 lg:w-72"
            />
          </aside>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 animate-slideInLeft">
            Guia Completo de Instalacao
          </h1>
          <p className="text-xl text-gray-600 animate-slideInRight">
            Siga os passos para comecar a usar sua maquina Machine Pay.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Manual;
