import React from 'react';
import StepCard from '../components/StepCard';

const steps = [
  {
    number: 1,
    title: 'Desembalando e Verificando',
    description: 'Abra a caixa com cuidado e certifique-se de que todos os itens estão presentes: Machine Pay, chicote de instalação, adesivo pix e qr code pix, maquininha de cartão e carregador da mesma.',
  },
  {
    number: 2,
    title: 'Conexão de Energia',
    description: 'Conecte o chicote enviado (duas pontas, uma macho e outra fêmea), retire o chicote original do moedeiro, conecte este no fêmea da machine pay e o macho da machine pay conecte onde estava o original do moedeiro.',
  },
  {
    number: 3,
    title: 'Fiação dos Cabos do Chicote',
    description: 'Se for o caso da sua Machine Pay vir sem chicote apenas ligue cada fio com outro de cor correspondente que saia do chicote do moedeiro (vermelho com vermelho, branco com branco, preto com preto)',
  },
  {
    number: 4,
    title: 'Carregador da Maquininha de cartão',
    description: 'O carregador da maquininha de cartão deve sair da machine pay e se conectar à maquininha de cartão, ele é um cabo usb, então se já estiver ligado à maquininha de cartão apenas ligue o usb na machine pay.',
  },
  {
    number: 5,
    title: 'Wi-Fi e ID',
    description: 'Entre nas configurações do seu celular e vá em Wi-Fi, busque a rede com nome Machine-Pay e clique nela, entre com a senha 01012024 e clique em OPÇÕES / SENHA para criar sua senha, depois vá em configurações e faça a conexão dela ao Wi-Fi e ao ID da sua maquininha.',
  },
  {
    number: 6,
    title: 'Maquininha de Cartão',
    description: 'A maquininha de cartão precisa ser configurada ao seu mercado pago, leia o QR code que aparece nela após conectá-la ao Wi-Fi e escolha o caixa referente à esta Machine Pay.',
  },
];

const Manual = () => {
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-r from-orange-500 to-purple-600 pb-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 animate-slideInLeft">
            Guia Completo de Instalação
          </h1>
          <p className="text-xl text-gray-600 animate-slideInRight">
            Siga estes 5 passos simples para começar a usar sua máquina MachinePay.
          </p>
        </header>

        {/* Grade de Passos */}
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