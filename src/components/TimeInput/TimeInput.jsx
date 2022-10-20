/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';

const TimeInput = ({value = new Date(), format = '%D/%M/%Y %h:%m:%s', onChange = () => {} }) => {

/**
 * @param {Date} value Объект даты, переданный из родительского компонента
 * @param {string} format Формат отображения даты
 * Доступные поля:
 * %Y - Год
 * %M - Месяц
 * %D - День
 * %h - Час
 * %m - Минуты
 * %s - Секунды
 * Между каждым полем должен быть разделительный символ
 * @param {function} onChange Функция для передачи изменённого объекта даты родительскому компоненту
*/

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const [inputMode, setInputMode] = useState(false);
    const [inputText, setInputText] = useState('');

    const [positions, setPositions] = useState({});
    const [timeString, setTimeString] = useState('');
    const [focus, setFocus] = useState(undefined);
    const ref = useRef(null);

    useEffect(() => {
        let pos = {}
        let temp = format;

        const values = {
            '%Y': {
                val: value.getFullYear().toString(),
                verbal: 'year'
            },
            '%M': {
                val: months[value.getMonth()],
                verbal: 'month'
            },
            '%D': {
                val: value.getDate().toString().padStart(2, '0'),
                verbal: 'date'
            },
            '%h': {
                val: value.getHours().toString().padStart(2, '0'),
                verbal: 'hours'
            },
            '%m': {
                val: value.getMinutes().toString().padStart(2, '0'),
                verbal: 'minutes'
            },
            '%s': {
                val: value.getSeconds().toString().padStart(2, '0'),
                verbal: 'seconds'
            }
        }

        let i = 0;

        while (i < temp.length) {
            if (temp[i] === '%') {
                if (temp[i + 1] === '%') temp = temp.replace('%%', '%');
                else {
                    if (values[`%${temp[i + 1]}`] !== undefined) {
                        let data = values[`%${temp[i + 1]}`];
                        pos[data.verbal] = {
                            start: i,
                            end: i + data.val.length
                        };
                        temp = temp.replace(`%${temp[i + 1]}`, data.val);
                    }
                }
            }

            i++;
        }

        setPositions(pos);
        setTimeString(temp);    
    }, [value, format]);

    useEffect(() => {
        if (focus !== undefined) 
            ref.current.setSelectionRange(positions[focus].start, positions[focus].end);
    }, [timeString, focus]);

    function keyPress(e) {
        if (inputMode) {
            if (e.key === 'Enter') stopInput();
            return;
        }

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();

            // Проверка какое поле пользователь пытается изменить
            Object.keys(positions).forEach((verbal) => {
                if (positions[verbal].start <= ref.current.selectionStart && 
                    positions[verbal].end >= ref.current.selectionStart) {
                    setFocus(verbal);

                    // Создание нового объекта для ререндера
                    const newValue = new Date(value);
                    const offset = (e.key === 'ArrowUp' ? 1 : -1)

                    switch (verbal) {
                        case 'year':
                            newValue.setFullYear(value.getFullYear() + offset);
                            break;
                        case 'month':
                            if (e.ctrlKey) newValue.setMonth(value.getMonth() + offset);
                            else newValue.setMonth((12 + value.getMonth() + offset) % 12);
                            break;
                        case 'date':
                            // Получение дней в месяце
                            const daysInMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();

                            if (e.ctrlKey) newValue.setDate(value.getDate() + offset);
                            else newValue.setDate((daysInMonth + value.getDate() - 1 + offset) % daysInMonth + 1);
                            break;
                        case 'hours':
                            if (e.ctrlKey) newValue.setHours(value.getHours() + offset);
                            else newValue.setHours((24 + value.getHours() + offset) % 24);
                            break;
                        case 'minutes':
                            if (e.ctrlKey) newValue.setMinutes(value.getMinutes() + offset);
                            else newValue.setMinutes((60 + value.getMinutes() + offset) % 60);
                            break;
                        case 'seconds':
                            if (e.ctrlKey) newValue.setSeconds(value.getSeconds() + offset);
                            else newValue.setSeconds((60 + value.getSeconds() + offset) % 60);
                            break;
                        default: 
                            break;
                    }
                    
                    // Возвращение объекта
                    onChange(newValue);
                }
            });
        } else {
            setFocus(undefined);
        }

        if (e.key === 'Backspace') setInputMode(true);
    }

    function onInput(e) {
        if (inputMode) setInputText(e.target.value);
    }

    function stopInput(e) {
        if (inputMode) {
            const newValue = new Date(inputText);
            console.log(newValue);
            if (newValue.toString() !== 'Invalid Date') onChange(newValue);
            setInputMode(false);
            setInputText('');
        }
    }

    return <input
        type="text" 
        value={(inputMode ? inputText : timeString)}
        onClick={keyPress}
        onKeyDown={keyPress}
        onChange={onInput}
        onBlur={stopInput}
        ref={ref}
        style={{width: '200px'}}
    />
}

export default TimeInput;
