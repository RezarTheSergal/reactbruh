import { useState } from 'react';

function useLocalStorage(key, initialValue) {
    // Получаем значение из localStorage или используем initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Ошибка при чтении из localStorage с ключом "${key}":`, error);
            return initialValue;
        }
    });

    // Обновляем localStorage при изменении значения
    const setValue = (value) => {
        try {
            // Позволяем использовать функцию для обновления значения, как в useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Ошибка при записи в localStorage с ключом "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;