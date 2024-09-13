import React, { useState, useEffect, useRef } from 'react';

const MultiCommandAnonymousConsole = () => {
  const [output, setOutput] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const outputRef = useRef(null);

  const commands = [
    { cmd: 'whoami', result: 'fidis' },
    { cmd: 'pwd', result: '/home/fidis' },
    { cmd: 'ls -la', result: `total 20
drwxr-xr-x 2 fidis fidis 4096 Sep 13 12:00 .
drwxr-xr-x 3 root      root      4096 Sep 13 11:00 ..
-rw-r--r-- 1 fidis fidis  220 Sep 13 10:00 .bash_logout
-rw-r--r-- 1 fidis fidis 3526 Sep 13 10:00 .bashrc
-rw-r--r-- 1 fidis fidis  807 Sep 13 10:00 .profile` },
    { cmd: 'cat bio.txt', result: `Name: fidis
Age: ?? 
Skills: Unix, Python, C, Bug bounty, Pentest, Red Team
Achievements: ??` },
  ];

  const prompt = 'root@fidis:~$ ';

  useEffect(() => {
    const animateCommands = async () => {
      // Добавляем задержку перед началом выполнения команд
      await new Promise(resolve => setTimeout(resolve, 500)); // Задержка .5 секунды

      for (const { cmd, result } of commands) {
        // Анимация ввода команды
        setCurrentInput(prompt);
        let commandInput = '';
        for (const char of cmd) {
          await new Promise(resolve => setTimeout(resolve, 120)); // Уменьшена задержка между символами
          commandInput += char;
          setCurrentInput(`${prompt}${commandInput}`);
        }

        // Небольшая пауза после ввода команды
        await new Promise(resolve => setTimeout(resolve, 50)); // Уменьшена пауза

        // Обновление состояния
        setOutput(prev => {
          // Проверка, что команда и результат не были добавлены ранее
          const isCommandAdded = prev.some(item => item.content === `${prompt}${cmd}`);
          const isResultAdded = prev.some(item => item.content === result);

          if (!isCommandAdded && !isResultAdded) {
            return [...prev, { type: 'command', content: `${prompt}${cmd}` }, { type: 'result', content: result }];
          }
          return prev;
        });

        setCurrentInput('');

        // Прокрутка вниз
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }

        // Пауза перед следующей командой
        await new Promise(resolve => setTimeout(resolve, 500)); // Уменьшена пауза
      }
    };

    animateCommands();
  }, []);

  return (
    <div className="bg-black text-white p-4 font-mono h-screen flex flex-col">
      <div ref={outputRef} className="flex-grow overflow-auto">
        {output.map((item, index) => (
          <div key={index} className={item.type === 'result' ? 'pl-4' : ''}>
            <pre className="whitespace-pre-wrap">{item.content}</pre>
          </div>
        ))}
        <span>{currentInput}</span>
      </div>
    </div>
  );
};

export default MultiCommandAnonymousConsole;
