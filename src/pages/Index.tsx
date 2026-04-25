import { useState } from 'react';
import Icon from '@/components/ui/icon';

// ─── Types ───────────────────────────────────────────────────────────────────

type IconName = string;
type Section = 'chats' | 'contacts' | 'profile' | 'notifications' | 'security' | 'archive';

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  role?: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  away?: boolean;
  group?: boolean;
  members?: number;
  messages: Message[];
}

interface Contact {
  id: number;
  name: string;
  role: string;
  dept: string;
  email: string;
  phone: string;
  online: boolean;
  away?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHATS: Chat[] = [
  {
    id: 1, name: 'Артём Белов', role: 'Директор по развитию', lastMsg: 'Презентация готова к отправке', time: '14:32',
    unread: 2, online: true,
    messages: [
      { id: 1, text: 'Добрый день, Михаил. Когда будет готов отчёт за Q3?', time: '14:15', out: false, read: true },
      { id: 2, text: 'Добрый день! Работаю над ним, готово будет к 16:00.', time: '14:18', out: true, read: true },
      { id: 3, text: 'Отлично. Дополнительно прошу включить сводку по регионам.', time: '14:25', out: false, read: true },
      { id: 4, text: 'Понял, включу. Презентация готова к отправке.', time: '14:32', out: true, read: false },
    ]
  },
  {
    id: 2, name: 'Совет директоров', lastMsg: 'Встреча перенесена на пятницу', time: '13:10',
    unread: 5, online: false, group: true, members: 8,
    messages: [
      { id: 1, text: 'Коллеги, встреча перенесена на пятницу, 10:00.', time: '13:10', out: false, read: true },
      { id: 2, text: 'Принято, спасибо за уведомление.', time: '13:12', out: true, read: true },
    ]
  },
  {
    id: 3, name: 'Елена Соколова', role: 'Финансовый директор', lastMsg: 'Бюджет согласован на следующий год', time: '11:48',
    unread: 0, online: true, away: true,
    messages: [
      { id: 1, text: 'Михаил, бюджет согласован на следующий год.', time: '11:48', out: false, read: true },
      { id: 2, text: 'Отличная новость. Направьте финальный документ на согласование.', time: '11:52', out: true, read: true },
    ]
  },
  {
    id: 4, name: 'Проект «Меркурий»', lastMsg: 'Дедлайн — 30 апреля', time: 'Вчера',
    unread: 0, online: false, group: true, members: 12,
    messages: [
      { id: 1, text: 'Напоминаю: дедлайн по проекту — 30 апреля.', time: 'Вчера', out: false, read: true },
    ]
  },
  {
    id: 5, name: 'Игорь Краснов', role: 'Руководитель IT', lastMsg: 'Система обновлена до v4.2', time: 'Вчера',
    unread: 0, online: false,
    messages: [
      { id: 1, text: 'Система безопасно обновлена до версии 4.2. Всё работает штатно.', time: 'Вчера', out: false, read: true },
    ]
  },
  {
    id: 6, name: 'Юридический отдел', lastMsg: 'Договор проверен, замечаний нет', time: 'Пн',
    unread: 0, online: false, group: true, members: 4,
    messages: [
      { id: 1, text: 'Договор с партнёром проверен, замечаний нет. Готово к подписанию.', time: 'Пн', out: false, read: true },
    ]
  },
];

const CONTACTS: Contact[] = [
  { id: 1, name: 'Артём Белов', role: 'Директор по развитию', dept: 'Стратегия', email: 'a.belov@corp.ru', phone: '+7 (495) 100-01-01', online: true },
  { id: 2, name: 'Елена Соколова', role: 'Финансовый директор', dept: 'Финансы', email: 'e.sokolova@corp.ru', phone: '+7 (495) 100-01-02', online: true, away: true },
  { id: 3, name: 'Игорь Краснов', role: 'Руководитель IT', dept: 'Технологии', email: 'i.krasnov@corp.ru', phone: '+7 (495) 100-01-03', online: false },
  { id: 4, name: 'Наталья Воронова', role: 'HR-директор', dept: 'Персонал', email: 'n.voronova@corp.ru', phone: '+7 (495) 100-01-04', online: false },
  { id: 5, name: 'Сергей Мальцев', role: 'Операционный директор', dept: 'Операции', email: 's.maltsev@corp.ru', phone: '+7 (495) 100-01-05', online: true },
  { id: 6, name: 'Анна Фирсова', role: 'Юридический советник', dept: 'Юридический', email: 'a.firsova@corp.ru', phone: '+7 (495) 100-01-06', online: false },
];

const NOTIFICATIONS = [
  { id: 1, icon: 'MessageSquare', text: 'Артём Белов прислал новое сообщение', time: '5 мин назад', read: false },
  { id: 2, icon: 'Users', text: 'Совет директоров: 5 новых сообщений', time: '20 мин назад', read: false },
  { id: 3, icon: 'Shield', text: 'Выполнено резервное шифрование ключей', time: '1 ч назад', read: false },
  { id: 4, icon: 'UserPlus', text: 'Наталья Воронова добавила вас в контакты', time: '2 ч назад', read: true },
  { id: 5, icon: 'Lock', text: 'Сеанс подтверждён с нового устройства', time: 'Вчера', read: true },
  { id: 6, icon: 'Archive', text: 'Диалог «Проект Альфа» перемещён в архив', time: 'Вчера', read: true },
];

const ARCHIVE_CHATS = [
  { id: 10, name: 'Проект «Альфа»', lastMsg: 'Проект завершён. Документация сдана.', time: '15 апр', group: true, members: 6 },
  { id: 11, name: 'Дмитрий Орлов', lastMsg: 'Спасибо за сотрудничество.', time: '2 апр', group: false },
  { id: 12, name: 'Тендерная комиссия', lastMsg: 'Тендер закрыт, победитель выбран.', time: '28 мар', group: true, members: 9 },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, size = 'md', online, away }: { name: string; size?: 'sm' | 'md' | 'lg'; online?: boolean; away?: boolean }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('');
  const colors = ['215 55% 28%', '220 50% 30%', '230 45% 32%', '200 50% 28%', '240 40% 32%'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-lg flex items-center justify-center font-semibold text-white tracking-wide`}
        style={{ background: `hsl(${color})` }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${away ? 'status-away' : online ? 'status-online' : 'status-offline'}`} />
      )}
    </div>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({ icon, label, active, badge, onClick }: {
  icon: string; label: string; active: boolean; badge?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-full flex flex-col items-center gap-1 py-3 px-1 rounded-lg transition-all duration-200 group relative
        ${active
          ? 'text-white bg-[hsl(220,22%,20%)]'
          : 'text-[hsl(220,12%,48%)] hover:text-[hsl(220,15%,72%)] hover:bg-[hsl(220,22%,16%)]'
        }`}
    >
      <div className="relative">
        <Icon name={icon as IconName} size={20} />
        {badge ? (
          <span className="absolute -top-1.5 -right-1.5 bg-[hsl(210,90%,55%)] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        ) : null}
      </div>
      <span className="text-[10px] font-medium tracking-wide leading-none">{label}</span>
    </button>
  );
}

// ─── ChatList ─────────────────────────────────────────────────────────────────

function ChatList({ chats, selected, onSelect }: {
  chats: Chat[]; selected: number | null; onSelect: (id: number) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-[hsl(220,18%,20%)]">
        <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em] mb-3">Сообщения</h2>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,12%,40%)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск диалогов..."
            className="w-full bg-[hsl(220,22%,11%)] border border-[hsl(220,18%,22%)] text-[hsl(220,15%,85%)] placeholder-[hsl(220,12%,40%)] text-sm rounded-md pl-8 pr-3 py-2 outline-none focus:border-[hsl(210,90%,45%)] transition-colors"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 animate-slide-in
              ${selected === chat.id
                ? 'bg-[hsl(215,55%,18%)] border-r-2 border-[hsl(210,90%,58%)]'
                : 'hover:bg-[hsl(220,22%,17%)]'
              }`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <Avatar name={chat.name} online={chat.online} away={chat.away} />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm font-medium truncate ${selected === chat.id ? 'text-white' : 'text-[hsl(220,15%,85%)]'}`}>
                  {chat.name}
                </span>
                <span className="text-[11px] text-[hsl(220,12%,42%)] ml-2 flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[hsl(220,12%,48%)] truncate">{chat.lastMsg}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 bg-[hsl(210,90%,55%)] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 flex-shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-[hsl(220,18%,20%)]">
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-[hsl(215,55%,22%)] hover:bg-[hsl(215,55%,28%)] text-[hsl(210,90%,75%)] text-sm font-medium rounded-md transition-colors">
          <Icon name="Plus" size={15} />
          Новый диалог
        </button>
      </div>
    </div>
  );
}

// ─── ChatView ─────────────────────────────────────────────────────────────────

function ChatView({ chat }: { chat: Chat }) {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[hsl(220,18%,18%)] bg-[hsl(220,22%,11%)]">
        <Avatar name={chat.name} size="md" online={chat.online} away={chat.away} />
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[hsl(220,15%,92%)]">{chat.name}</div>
          <div className="text-[12px] text-[hsl(220,12%,48%)]">
            {chat.group ? `${chat.members} участников` : chat.online ? (chat.away ? 'Не в сети' : 'В сети') : 'Не в сети'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(['Phone', 'Video', 'Search', 'MoreVertical'] as const).map(ic => (
            <button key={ic} className="p-2 text-[hsl(220,12%,48%)] hover:text-[hsl(220,15%,72%)] hover:bg-[hsl(220,22%,18%)] rounded-md transition-colors">
              <Icon name={ic} size={17} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2 bg-[hsl(220,22%,9%)]">
        <Icon name="Lock" size={11} className="text-[hsl(220,12%,36%)]" />
        <span className="text-[11px] text-[hsl(220,12%,36%)] font-medium tracking-wide">Сквозное шифрование активно · AES-256</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {chat.messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.out ? 'justify-end' : 'justify-start'} animate-msg`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
              msg.out
                ? 'bg-[hsl(215,55%,25%)] rounded-br-sm text-[hsl(210,60%,95%)]'
                : 'bg-[hsl(220,18%,20%)] rounded-bl-sm text-[hsl(220,15%,85%)]'
            }`}>
              <p className="text-[14px] leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[11px] text-[hsl(220,12%,52%)]">{msg.time}</span>
                {msg.out && (
                  <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className={msg.read ? 'text-[hsl(210,90%,65%)]' : 'text-[hsl(220,12%,45%)]'} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-[hsl(220,18%,18%)] bg-[hsl(220,22%,10%)]">
        <div className="flex items-end gap-3">
          <button className="p-2 text-[hsl(220,12%,42%)] hover:text-[hsl(220,15%,65%)] transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={18} />
          </button>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Введите сообщение..."
            rows={1}
            className="flex-1 bg-[hsl(220,22%,16%)] border border-[hsl(220,18%,22%)] text-[hsl(220,15%,88%)] placeholder-[hsl(220,12%,40%)] text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[hsl(210,90%,45%)] resize-none transition-colors"
          />
          <button className="p-2 text-[hsl(220,12%,42%)] hover:text-[hsl(220,15%,65%)] transition-colors flex-shrink-0">
            <Icon name="Smile" size={18} />
          </button>
          <button className="p-2.5 bg-[hsl(210,90%,45%)] hover:bg-[hsl(210,90%,52%)] text-white rounded-lg transition-colors flex-shrink-0">
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ContactsSection ──────────────────────────────────────────────────────────

function ContactsSection() {
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState('');
  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full">
      <div className="w-72 border-r border-[hsl(220,18%,20%)] flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-[hsl(220,18%,20%)]">
          <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em] mb-3">Адресная книга</h2>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,12%,40%)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск контактов..."
              className="w-full bg-[hsl(220,22%,11%)] border border-[hsl(220,18%,22%)] text-[hsl(220,15%,85%)] placeholder-[hsl(220,12%,40%)] text-sm rounded-md pl-8 pr-3 py-2 outline-none focus:border-[hsl(210,90%,45%)] transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all animate-slide-in
                ${selected?.id === c.id ? 'bg-[hsl(215,55%,18%)] border-r-2 border-[hsl(210,90%,58%)]' : 'hover:bg-[hsl(220,22%,17%)]'}`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <Avatar name={c.name} online={c.online} away={c.away} />
              <div className="text-left">
                <div className="text-sm font-medium text-[hsl(220,15%,85%)]">{c.name}</div>
                <div className="text-[12px] text-[hsl(220,12%,48%)]">{c.role}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[hsl(220,18%,20%)]">
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-[hsl(215,55%,22%)] hover:bg-[hsl(215,55%,28%)] text-[hsl(210,90%,75%)] text-sm font-medium rounded-md transition-colors">
            <Icon name="UserPlus" size={15} />
            Добавить контакт
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[hsl(220,20%,10%)]">
        {selected ? (
          <div className="w-full max-w-md px-8 animate-fade-in">
            <div className="flex flex-col items-center mb-8">
              <Avatar name={selected.name} size="lg" online={selected.online} away={selected.away} />
              <h2 className="mt-4 text-xl font-semibold text-[hsl(220,15%,92%)]">{selected.name}</h2>
              <p className="text-sm text-[hsl(220,12%,52%)] mt-1">{selected.role}</p>
              <span className="mt-2 px-3 py-1 bg-[hsl(220,22%,18%)] text-[hsl(220,15%,58%)] text-[11px] font-medium rounded-full tracking-wide uppercase">
                {selected.dept}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { icon: 'Mail', label: 'Email', value: selected.email },
                { icon: 'Phone', label: 'Телефон', value: selected.phone },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4 p-4 bg-[hsl(220,22%,14%)] rounded-lg border border-[hsl(220,18%,20%)]">
                  <Icon name={row.icon as IconName} size={16} className="text-[hsl(210,90%,58%)]" />
                  <div>
                    <div className="text-[11px] text-[hsl(220,12%,45%)] uppercase tracking-wide mb-0.5">{row.label}</div>
                    <div className="text-sm text-[hsl(220,15%,82%)]">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[hsl(215,55%,22%)] hover:bg-[hsl(215,55%,28%)] text-[hsl(210,90%,75%)] text-sm font-medium rounded-lg transition-colors">
                <Icon name="MessageSquare" size={15} />
                Написать
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[hsl(220,22%,18%)] hover:bg-[hsl(220,22%,22%)] text-[hsl(220,15%,65%)] text-sm font-medium rounded-lg transition-colors">
                <Icon name="Phone" size={15} />
                Позвонить
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <Icon name="BookUser" size={40} className="text-[hsl(220,18%,28%)] mx-auto mb-3" />
            <p className="text-sm text-[hsl(220,12%,40%)]">Выберите контакт для просмотра</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ProfileSection ───────────────────────────────────────────────────────────

function ProfileSection() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 animate-fade-in">
      <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em] mb-6">Профиль</h2>
      <div className="max-w-lg">
        <div className="flex items-center gap-5 mb-8 p-6 bg-[hsl(220,22%,14%)] rounded-xl border border-[hsl(220,18%,20%)]">
          <Avatar name="Михаил Орлов" size="lg" online={true} />
          <div>
            <h3 className="text-lg font-semibold text-[hsl(220,15%,92%)]">Михаил Орлов</h3>
            <p className="text-sm text-[hsl(220,12%,52%)] mt-0.5">Генеральный директор</p>
            <p className="text-[12px] text-[hsl(210,90%,58%)] mt-1.5 flex items-center gap-1">
              <Icon name="Shield" size={11} />
              Администратор · Уровень доступа: Максимальный
            </p>
          </div>
          <button className="ml-auto p-2 text-[hsl(220,12%,42%)] hover:text-[hsl(220,15%,65%)] hover:bg-[hsl(220,22%,20%)] rounded-md transition-colors">
            <Icon name="Pencil" size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Имя', value: 'Михаил', icon: 'User' },
            { label: 'Фамилия', value: 'Орлов', icon: 'User' },
            { label: 'Email', value: 'm.orlov@corp.ru', icon: 'Mail' },
            { label: 'Должность', value: 'Генеральный директор', icon: 'Briefcase' },
            { label: 'Отдел', value: 'Высшее руководство', icon: 'Building2' },
            { label: 'Телефон', value: '+7 (495) 100-00-01', icon: 'Phone' },
          ].map((field, i) => (
            <div
              key={field.label}
              className="p-4 bg-[hsl(220,22%,14%)] rounded-lg border border-[hsl(220,18%,20%)] flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Icon name={field.icon as IconName} size={15} className="text-[hsl(210,90%,55%)] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[11px] text-[hsl(220,12%,45%)] uppercase tracking-wide mb-0.5">{field.label}</div>
                <div className="text-sm text-[hsl(220,15%,82%)]">{field.value}</div>
              </div>
              <button className="text-[hsl(220,12%,38%)] hover:text-[hsl(220,15%,60%)] transition-colors">
                <Icon name="Pencil" size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[hsl(220,22%,14%)] rounded-lg border border-[hsl(220,18%,20%)]">
          <div className="text-[13px] font-semibold text-[hsl(220,15%,70%)] mb-3">Статус присутствия</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'В сети', color: '#22c55e', active: true },
              { label: 'Занят', color: '#f59e0b', active: false },
              { label: 'Не беспокоить', color: '#ef4444', active: false },
              { label: 'Невидимый', color: 'hsl(220,12%,40%)', active: false },
            ].map(s => (
              <button
                key={s.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all
                  ${s.active ? 'bg-[hsl(220,22%,22%)] text-[hsl(220,15%,85%)]' : 'text-[hsl(220,12%,45%)] hover:bg-[hsl(220,22%,18%)] hover:text-[hsl(220,15%,72%)]'}`}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NotificationsSection ─────────────────────────────────────────────────────

function NotificationsSection() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em]">
          Центр уведомлений
          {unread > 0 && (
            <span className="ml-2 bg-[hsl(210,90%,50%)] text-white text-[10px] font-bold rounded-full px-2 py-0.5 normal-case">
              {unread} новых
            </span>
          )}
        </h2>
        <button className="text-[12px] text-[hsl(210,90%,58%)] hover:text-[hsl(210,90%,70%)] transition-colors">
          Отметить все прочитанными
        </button>
      </div>
      <div className="max-w-lg space-y-2">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 rounded-lg border transition-all animate-fade-in
              ${n.read
                ? 'bg-[hsl(220,22%,13%)] border-[hsl(220,18%,18%)]'
                : 'bg-[hsl(215,40%,15%)] border-[hsl(215,45%,22%)]'
              }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${n.read ? 'bg-[hsl(220,22%,18%)]' : 'bg-[hsl(215,55%,22%)]'}`}>
              <Icon name={n.icon as IconName} size={15} className={n.read ? 'text-[hsl(220,12%,48%)]' : 'text-[hsl(210,90%,65%)]'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${n.read ? 'text-[hsl(220,12%,55%)]' : 'text-[hsl(220,15%,85%)]'}`}>{n.text}</p>
              <p className="text-[11px] text-[hsl(220,12%,40%)] mt-1">{n.time}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-[hsl(210,90%,58%)] flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SecuritySection ──────────────────────────────────────────────────────────

function SecuritySection() {
  const [toggles, setToggles] = useState([true, true, false, false, true, true]);

  const settings = [
    { label: 'Сквозное шифрование', desc: 'Все сообщения шифруются алгоритмом AES-256', icon: 'Lock' },
    { label: 'Двухфакторная аутентификация', desc: 'Вход только после подтверждения кода', icon: 'ShieldCheck' },
    { label: 'Автоудаление сообщений', desc: 'Удалять переписку через 90 дней', icon: 'Trash2' },
    { label: 'Снимки экрана запрещены', desc: 'Блокировать скриншоты в приложении', icon: 'EyeOff' },
    { label: 'Журнал сеансов', desc: 'Уведомлять о входах с новых устройств', icon: 'Activity' },
    { label: 'Анонимизация метаданных', desc: 'Скрывать время и геолокацию', icon: 'UserX' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 animate-fade-in">
      <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em] mb-6">Безопасность и конфиденциальность</h2>
      <div className="max-w-lg">
        <div className="mb-6 p-4 bg-[hsl(215,50%,13%)] border border-[hsl(215,45%,22%)] rounded-xl flex items-center gap-3">
          <Icon name="ShieldCheck" size={22} className="text-[hsl(210,90%,60%)]" />
          <div>
            <p className="text-sm font-semibold text-[hsl(220,15%,88%)]">Уровень защиты: Максимальный</p>
            <p className="text-[12px] text-[hsl(220,12%,52%)] mt-0.5">Ключевые параметры безопасности активны</p>
          </div>
        </div>

        <div className="space-y-3">
          {settings.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-4 p-4 bg-[hsl(220,22%,14%)] rounded-lg border border-[hsl(220,18%,20%)] animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={`p-2 rounded-lg ${toggles[i] ? 'bg-[hsl(215,55%,20%)]' : 'bg-[hsl(220,22%,18%)]'}`}>
                <Icon name={s.icon as IconName} size={15} className={toggles[i] ? 'text-[hsl(210,90%,62%)]' : 'text-[hsl(220,12%,42%)]'} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[hsl(220,15%,82%)]">{s.label}</div>
                <div className="text-[12px] text-[hsl(220,12%,46%)]">{s.desc}</div>
              </div>
              <button
                onClick={() => setToggles(prev => prev.map((v, idx) => idx === i ? !v : v))}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${toggles[i] ? 'bg-[hsl(210,90%,45%)]' : 'bg-[hsl(220,18%,28%)]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${toggles[i] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[hsl(220,22%,14%)] rounded-lg border border-[hsl(220,18%,20%)]">
          <div className="text-[13px] font-semibold text-[hsl(220,15%,70%)] mb-3">Активные сеансы</div>
          {[
            { device: 'MacBook Pro — Москва, Россия', time: 'Сейчас', current: true },
            { device: 'iPhone 15 — Москва, Россия', time: '2 ч назад', current: false },
          ].map(sess => (
            <div key={sess.device} className="flex items-center justify-between py-2.5 border-b border-[hsl(220,18%,20%)] last:border-0">
              <div>
                <p className="text-sm text-[hsl(220,15%,78%)]">{sess.device}</p>
                <p className="text-[11px] text-[hsl(220,12%,44%)]">{sess.time}</p>
              </div>
              {sess.current
                ? <span className="text-[11px] text-[hsl(120,50%,55%)] font-medium">Текущий</span>
                : <button className="text-[12px] text-[hsl(0,65%,55%)] hover:text-[hsl(0,65%,65%)] transition-colors">Завершить</button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ArchiveSection ───────────────────────────────────────────────────────────

function ArchiveSection() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 animate-fade-in">
      <h2 className="text-[13px] font-semibold text-[hsl(220,15%,55%)] uppercase tracking-[0.1em] mb-6">Архив диалогов</h2>
      <div className="max-w-lg">
        <p className="text-[12px] text-[hsl(220,12%,42%)] mb-4">{ARCHIVE_CHATS.length} завершённых диалога</p>
        <div className="space-y-2">
          {ARCHIVE_CHATS.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4 bg-[hsl(220,22%,13%)] rounded-lg border border-[hsl(220,18%,18%)] hover:bg-[hsl(220,22%,15%)] transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative">
                <Avatar name={c.name} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[hsl(220,22%,20%)] rounded-full flex items-center justify-center">
                  <Icon name="Archive" size={10} className="text-[hsl(220,12%,50%)]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="text-sm font-medium text-[hsl(220,15%,72%)]">{c.name}</span>
                  <span className="text-[11px] text-[hsl(220,12%,38%)]">{c.time}</span>
                </div>
                <div className="text-[12px] text-[hsl(220,12%,42%)] truncate">{c.lastMsg}</div>
              </div>
              <button className="p-1.5 text-[hsl(220,12%,38%)] hover:text-[hsl(210,90%,60%)] hover:bg-[hsl(215,40%,18%)] rounded transition-colors">
                <Icon name="RotateCcw" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const Index = () => {
  const [section, setSection] = useState<Section>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);

  const totalUnread = CHATS.reduce((s, c) => s + c.unread, 0);
  const notifUnread = NOTIFICATIONS.filter(n => !n.read).length;

  const nav = [
    { key: 'chats',         icon: 'MessageSquare', label: 'Чаты',     badge: totalUnread },
    { key: 'contacts',      icon: 'BookUser',      label: 'Контакты', badge: 0 },
    { key: 'notifications', icon: 'Bell',          label: 'Центр',    badge: notifUnread },
    { key: 'profile',       icon: 'CircleUser',    label: 'Профиль',  badge: 0 },
    { key: 'security',      icon: 'ShieldCheck',   label: 'Защита',   badge: 0 },
    { key: 'archive',       icon: 'Archive',       label: 'Архив',    badge: 0 },
  ] as const;

  const activeChat = CHATS.find(c => c.id === selectedChat);

  return (
    <div className="h-screen flex overflow-hidden bg-[hsl(220,20%,8%)]">

      {/* ── Left nav ── */}
      <aside className="w-16 flex flex-col items-center py-4 gap-1 bg-[hsl(220,22%,11%)] border-r border-[hsl(220,18%,18%)] flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[hsl(210,90%,42%)] flex items-center justify-center mb-4 flex-shrink-0">
          <Icon name="Lock" size={18} className="text-white" />
        </div>
        <div className="flex flex-col gap-0.5 w-full px-2 flex-1">
          {nav.map(item => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={section === item.key}
              badge={item.badge || undefined}
              onClick={() => setSection(item.key as Section)}
            />
          ))}
        </div>
        <div className="mt-auto px-2 w-full">
          <button
            onClick={() => setSection('profile')}
            className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-[hsl(220,22%,16%)] transition-colors"
          >
            <Avatar name="Михаил Орлов" size="sm" online={true} />
          </button>
        </div>
      </aside>

      {/* ── Chat panel ── */}
      {section === 'chats' && (
        <div className="w-72 flex-shrink-0 bg-[hsl(220,22%,13%)] border-r border-[hsl(220,18%,18%)] flex flex-col">
          <ChatList chats={CHATS} selected={selectedChat} onSelect={setSelectedChat} />
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 bg-[hsl(220,20%,10%)] flex flex-col overflow-hidden">
        {section === 'chats' && (
          activeChat
            ? <ChatView chat={activeChat} />
            : <div className="flex-1 flex items-center justify-center animate-fade-in">
                <div className="text-center">
                  <Icon name="MessageSquare" size={48} className="text-[hsl(220,18%,25%)] mx-auto mb-4" />
                  <p className="text-sm text-[hsl(220,12%,40%)]">Выберите диалог для начала</p>
                </div>
              </div>
        )}
        {section === 'contacts' && <ContactsSection />}
        {section === 'profile' && <ProfileSection />}
        {section === 'notifications' && <NotificationsSection />}
        {section === 'security' && <SecuritySection />}
        {section === 'archive' && <ArchiveSection />}
      </div>
    </div>
  );
};

export default Index;