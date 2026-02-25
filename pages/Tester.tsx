import React, { useState } from 'react';
import { ChevronRight, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const quizData: QuizQuestion[] = [
  {
    id: 1,
    scenario: "В модуле расчета скидок скопился огромный блок switch/case на 500 строк. Каждый case реализует свою формулу (Новогодняя, Оптовая, Накопительная). При добавлении новой акции приходится менять этот файл. Какой паттерн поможет инкапсулировать каждый алгоритм в отдельный класс?",
    options: ["State (Состояние)", "Strategy (Стратегия)", "Decorator (Декоратор)", "Command (Команда)"],
    correctAnswerIndex: 1,
    explanation: "Strategy выделяет каждый алгоритм в отдельный взаимозаменяемый класс. Клиентский код просто вызывает метод calculate() у переданной ему стратегии, избавляясь от switch/case."
  },
  {
    id: 2,
    scenario: "Система проводит документы с тяжелой бизнес-логикой (проверки, блокировки), но пользователям в UI нужны моментальные агрегированные отчеты по этим же данным. Единая модель данных тормозит. Как разделить чтение и запись?",
    options: ["Unit of Work", "CQRS", "Repository", "Event Sourcing"],
    correctAnswerIndex: 1,
    explanation: "CQRS (Command Query Responsibility Segregation) строго разделяет модель записи (Команды с бизнес-правилами) и модель чтения (Запросы к денормализованным/кэшированным данным)."
  },
  {
    id: 3,
    scenario: "Вам нужно интегрировать старую библиотеку отправки факсов. Её интерфейс принимает структуру XML, а ваша современная система работает с JSON и ожидает интерфейс INotificationService. Менять код библиотеки нельзя.",
    options: ["Facade (Фасад)", "Proxy (Заместитель)", "Adapter (Адаптер)", "Bridge (Мост)"],
    correctAnswerIndex: 2,
    explanation: "Adapter выступает прослойкой, которая переводит вызовы из формата вашей системы (JSON) в формат, понятный несовместимой библиотеке (XML)."
  },
  {
    id: 4,
    scenario: "При инициализации объекта 'Заказ' в конструктор передается 15 параметров, 10 из которых часто равны null (т.н. телескопический конструктор). Код становится нечитаемым. Что использовать?",
    options: ["Builder (Строитель)", "Abstract Factory", "Prototype (Прототип)", "Factory Method"],
    correctAnswerIndex: 0,
    explanation: "Builder позволяет создавать сложный объект пошагово (вызывая методы вроде .setCustomer(), .addDiscount()), изолируя процесс конструирования от самого объекта."
  },
  {
    id: 5,
    scenario: "При проведении документа 'Реализация' нужно обновить остатки на складе, начислить бонусы клиенту и отправить ему SMS. Если прописать всё в одном методе, модуль документа превратится в монолит, знающий обо всех системах.",
    options: ["Mediator (Посредник)", "Observer (Наблюдатель)", "Chain of Responsibility", "Command (Команда)"],
    correctAnswerIndex: 1,
    explanation: "Observer (Publish/Subscribe) позволяет документу просто выбросить событие 'Проведен'. Независимые слушатели (Склад, Бонусы, SMS) перехватят его и выполнят свою работу."
  },
  {
    id: 6,
    scenario: "В системе управления персоналом есть древовидная структура: Департаменты содержат Отделы, Отделы — Сотрудников. Нужно посчитать общий фонд оплаты труда для любого узла, не проверяя его тип (группа или конкретный сотрудник).",
    options: ["Decorator (Декоратор)", "Composite (Компоновщик)", "Iterator (Итератор)", "Visitor (Посетитель)"],
    correctAnswerIndex: 1,
    explanation: "Composite позволяет сгруппировать объекты в древовидные структуры и работать с ними так, как если бы это был единичный объект."
  },
  {
    id: 7,
    scenario: "Обращение к стороннему сервису погоды занимает 3 секунды. Нужно добавить кэширование результатов на 10 минут, не внося изменений в исходный класс клиента API.",
    options: ["Proxy (Заместитель)", "Adapter (Адаптер)", "Facade (Фасад)", "Bridge (Мост)"],
    correctAnswerIndex: 0,
    explanation: "Proxy предоставляет объект-заменитель, который перехватывает вызовы к оригинальному объекту, позволяя выполнить логику (например, кэширование) до или после вызова оригинала."
  },
  {
    id: 8,
    scenario: "Процесс генерации отчетов состоит из жестких шагов: сбор данных, форматирование, экспорт. Сбор и экспорт всегда одинаковы, а форматирование (PDF/Excel) зависит от типа отчета. Как избежать дублирования общего кода?",
    options: ["Strategy (Стратегия)", "Template Method (Шаблонный метод)", "Builder (Строитель)", "State (Состояние)"],
    correctAnswerIndex: 1,
    explanation: "Template Method определяет скелет алгоритма в базовом классе, позволяя подклассам переопределять отдельные шаги (форматирование), не меняя структуру алгоритма."
  },
  {
    id: 9,
    scenario: "Вы разрабатываете графический редактор. Необходима функция отмены действий (Ctrl+Z). При этом сам холст не должен открывать доступ к своим приватным массивам пикселей со стороны системы ведения истории.",
    options: ["Command (Команда)", "Memento (Снимок)", "Prototype (Прототип)", "State (Состояние)"],
    correctAnswerIndex: 1,
    explanation: "Memento позволяет сохранять и восстанавливать прошлые состояния объекта, не раскрывая деталей его внутренней реализации (инкапсуляции)."
  },
  {
    id: 10,
    scenario: "В браузерной игре нужно отрисовать лес из 100 000 деревьев. Если каждое дерево будет хранить 3D-модель и текстуры, оперативная память закончится. Как оптимизировать потребление памяти?",
    options: ["Singleton (Одиночка)", "Prototype (Прототип)", "Flyweight (Легковес)", "Proxy (Заместитель)"],
    correctAnswerIndex: 2,
    explanation: "Flyweight экономит оперативную память, разделяя общее внутреннее состояние (модель, текстура) между множеством объектов, оставляя в самих объектах только внешнее (координаты)."
  },
  {
    id: 11,
    scenario: "Для MVP приложения требуется быстро реализовать CRUD операции для сущности 'Пользователь'. Сложной доменной логики нет. Какой паттерн доступа к данным позволит максимально быстро связать объект с таблицей БД?",
    options: ["Repository", "Active Record", "Unit of Work", "Event Sourcing"],
    correctAnswerIndex: 1,
    explanation: "Active Record инкапсулирует данные строки БД и методы работы с ней (save, delete) прямо в объекте домена. Идеально для простых CRUD-приложений."
  },
  {
    id: 12,
    scenario: "В банковском приложении категорически запрещено просто перезаписывать поле 'баланс' UPDATE-запросом. Нужно хранить каждую транзакцию как неизменяемый факт, а текущий баланс вычислять на лету.",
    options: ["CQRS", "Event Sourcing", "Unit of Work", "Memento (Снимок)"],
    correctAnswerIndex: 1,
    explanation: "Event Sourcing предполагает хранение состояния как последовательности событий (дебет, кредит). Текущее состояние восстанавливается путем применения этих событий по порядку."
  },
  {
    id: 13,
    scenario: "Система должна использовать строго один экземпляр пула подключений к базе данных на всё приложение, чтобы избежать исчерпания лимита соединений с СУБД.",
    options: ["Singleton (Одиночка)", "Factory Method (Фабричный метод)", "Builder (Строитель)", "Facade (Фасад)"],
    correctAnswerIndex: 0,
    explanation: "Singleton гарантирует, что у класса есть только один экземпляр, и предоставляет к нему глобальную точку доступа."
  },
  {
    id: 14,
    scenario: "Приложение должно поддерживать светлую и темную темы. Кнопки, чекбоксы и окна из светлой темы не должны случайно смешиваться с элементами темной темы. Как гарантировать создание совместимых компонентов?",
    options: ["Builder (Строитель)", "Factory Method (Фабричный метод)", "Abstract Factory (Абстрактная фабрика)", "Prototype (Прототип)"],
    correctAnswerIndex: 2,
    explanation: "Abstract Factory предоставляет интерфейс для создания семейств взаимосвязанных или взаимозависимых объектов (элементов UI конкретной темы) без указания их конкретных классов."
  },
  {
    id: 15,
    scenario: "Фреймворк логистики знает, когда и куда нужно доставить груз, но не знает, какой именно транспорт будет использован (Грузовик или Судно). Создание конкретного транспорта нужно делегировать подклассам.",
    options: ["Factory Method (Фабричный метод)", "Abstract Factory (Абстрактная фабрика)", "Builder (Строитель)", "Strategy (Стратегия)"],
    correctAnswerIndex: 0,
    explanation: "Factory Method определяет общий интерфейс для создания объекта в суперклассе, но позволяет подклассам изменять тип создаваемых объектов."
  },
  {
    id: 16,
    scenario: "Есть иерархия устройств (Телевизор, Радио) и иерархия пультов (Обычный, Умный). Чтобы избежать декартова произведения классов (УмныйПультОтТелевизора, ОбычныйПультОтРадио), нужно разделить эти абстракции.",
    options: ["Adapter (Адаптер)", "Bridge (Мост)", "Composite (Компоновщик)", "Decorator (Декоратор)"],
    correctAnswerIndex: 1,
    explanation: "Bridge разделяет бизнес-логику (Пульт) и реализацию (Устройство) на две отдельные иерархии, которые могут развиваться независимо."
  },
  {
    id: 17,
    scenario: "Необходимо предоставить клиентам способ последовательного обхода сложной графовой структуры данных в ширину (BFS) и в глубину (DFS), скрыв детали внутренней реализации графа.",
    options: ["Visitor (Посетитель)", "Chain of Responsibility", "Iterator (Итератор)", "Strategy (Стратегия)"],
    correctAnswerIndex: 2,
    explanation: "Iterator дает возможность последовательно обходить элементы составных объектов, не раскрывая их внутреннего представления."
  },
  {
    id: 18,
    scenario: "Классы узлов синтаксического дерева (AST) заморожены для изменений. При этом регулярно требуется добавлять новые функции анализа или экспорта этого дерева. Как добавлять поведение, не меняя код узлов?",
    options: ["Visitor (Посетитель)", "Decorator (Декоратор)", "Observer (Наблюдатель)", "Template Method (Шаблонный метод)"],
    correctAnswerIndex: 0,
    explanation: "Visitor позволяет добавлять новые операции к существующей иерархии классов, не изменяя их исходный код, используя механизм двойной диспетчеризации."
  },
  {
    id: 19,
    scenario: "Необходимо реализовать планировщик задач, который умеет ставить действия в очередь, логировать их выполнение и запускать по расписанию. Само действие должно быть инкапсулировано как отдельный объект.",
    options: ["Strategy (Стратегия)", "Command (Команда)", "State (Состояние)", "Observer (Наблюдатель)"],
    correctAnswerIndex: 1,
    explanation: "Command превращает запросы (действия) в объекты, что позволяет передавать их как аргументы, ставить в очередь, логировать и поддерживать отмену операций."
  },
  {
    id: 20,
    scenario: "На форме бронирования авиабилетов 15 взаимозависимых полей (смена страны очищает город, выбор VIP-места блокирует эконом-тариф). Если элементы управления будут ссылаться друг на друга, получится спагетти-код.",
    options: ["Mediator (Посредник)", "Facade (Фасад)", "Observer (Наблюдатель)", "Bridge (Мост)"],
    correctAnswerIndex: 0,
    explanation: "Mediator (Посредник) инкапсулирует сложную логику взаимодействия множества компонентов в одном классе (модуль формы), избавляя компоненты от необходимости ссылаться друг на друга."
  }
];

export default function PatternTrainer() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quizData[currentIndex];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(prev => prev + 1);
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-gray-100 font-sans">
        <div className="max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-white">Архитектурный тренажер</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Симулятор решения архитектурных проблем. Выявляет умение подбирать паттерны проектирования (GoF / архитектурные) под конкретные конфликты требований и 'запахи кода'.
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto mx-auto"
          >
            Начать тестирование <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= quizData.length) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-gray-100">
        <div className="max-w-xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center w-full">
          <h2 className="text-3xl font-bold mb-6 text-white">Результат</h2>
          <div className="text-6xl font-black text-blue-500 mb-4">{percentage}%</div>
          <p className="text-xl text-gray-300 mb-8">
            Верных решений: {score} из {quizData.length}
          </p>
          
          <button 
            onClick={restartQuiz}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Повторить тренировку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 p-4 text-gray-100">
      <div className="max-w-3xl w-full">
        <div className="mb-6 flex justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-widest">
          <span>Сценарий {currentIndex + 1} / {quizData.length}</span>
          <span>Очки: {score}</span>
        </div>
        
        <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-white mb-8">
            {currentQuestion.scenario}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;
              
              let buttonStyle = "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-400 text-gray-200";
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = "bg-green-900/50 border-green-500 text-green-100";
                } else if (isSelected) {
                  buttonStyle = "bg-red-900/50 border-red-500 text-red-100";
                } else {
                  buttonStyle = "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className={`p-4 rounded-lg mb-8 border ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'bg-green-900/20 border-green-800/50 text-green-200' : 'bg-red-900/20 border-red-800/50 text-red-200'}`}>
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correctAnswerIndex ? 'Верно.' : 'Ошибка.'}
              </p>
              <p className="text-sm leading-relaxed opacity-90">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              onClick={nextQuestion}
              disabled={!isAnswered}
              className={`flex items-center px-6 py-3 rounded-lg font-bold transition-colors ${isAnswered ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            >
              {currentIndex === quizData.length - 1 ? 'Завершить' : 'Следующий сценарий'} <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}