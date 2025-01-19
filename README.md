# README: Konfiguracja wysyłania wiadomości e-mail

Ten dokument opisuje kroki niezbędne do dodania nowego sendera do backendu, aby można było korzystać z funkcjonalności wysyłania wiadomości e-mail z nowej strony internetowej.

---

## **1. Wymagania wstępne**

- Konto na platformie **SendGrid**.
- Dostęp do panelu DNS domeny, z której będzie wysyłany e-mail.
- Uprawnienia do edycji kodu backendu i wysyłania zapytań do API.

---

## **2. Konfiguracja SendGrid**

### **2.1 Dodanie nowego sendera**

1. **Zaloguj się na konto SendGrid.**
2. Przejdź do zakładki **Settings > Sender Authentication**.
3. Wybierz **Authenticate Your Domain**:
   - Podaj nazwę domeny, z której będzie wysyłany e-mail.
   - Skonfiguruj rekordy DNS (SPF, DKIM, DMARC) w panelu DNS domeny zgodnie z instrukcjami SendGrid.
   - Zweryfikuj konfigurację w SendGrid i poczekaj na potwierdzenie.

> **Uwaga:** Adres nadawcy (np. `KLIENT@nazwa-domeny.pl`) jest dynamicznie podawany w zapytaniu `fetch` w polu `sender` i nie wymaga dodawania go bezpośrednio w SendGrid.

---

## **3. Konfiguracja formularza**

1. Formularz na stronie internetowej powinien przesyłać następujące dane:

   - `name` - Imię osoby wysyłającej wiadomość.
   - `email` - Adres e-mail osoby wysyłającej.
   - `phone` - (Opcjonalnie) Numer telefonu osoby wysyłającej.
   - `subject` - Temat wiadomości.
   - `message` - Treść wiadomości.
   - `customTemplate` - (Opcjonalnie) Plik HTML szablonu wiadomości.

2. Formularz powinien wysyłać zapytanie HTTP POST do endpointu backendu:

   ```http
   POST https://backendapp-gamma.vercel.app/api/send-mail
   Content-Type: multipart/form-data
   ```

3. **Opcjonalne przesyłanie szablonu HTML**:

   - Możesz przesyłać własny szablon HTML w polu `customTemplate`. Szablon musi zawierać odpowiednie zmienne, które będą dynamicznie zastępowane wartościami:
     - `{{name}}`, `{{email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`.
   - Jeśli szablon HTML nie zostanie przesłany, backend automatycznie użyje domyślnego szablonu zapisanego na serwerze.

**Przykład minimalnego szablonu HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
  </style>
</head>
<body>
  <h2>Nowa wiadomość od: {{name}}</h2>
  <p>Email: {{email}}</p>
  <p>Telefon: {{phone}}</p>
  <h3>Temat: {{subject}}</h3>
  <p>{{message}}</p>
</body>
</html>
```

---

## **4. Przykładowe zapytanie HTTP**

**Przykładowy fetch w JavaScript z obsługą błędów:**

```javascript
const formData = new FormData();
formData.append('name', 'Jan Kowalski');
formData.append('email', 'jan.kowalski@example.com');
formData.append('phone', '123456789');
formData.append('subject', 'Zapytanie ofertowe');
formData.append('message', 'Chciałbym dowiedzieć się więcej o waszej ofercie.');

// Dodanie opcjonalnego szablonu HTML z lokalnego pliku
import customTemplate from './template.html'; // Import lokalnego pliku HTML
formData.append('customTemplate', new File([customTemplate], 'template.html', { type: 'text/html' }));

try {
  const response = await fetch('https://backendapp-gamma.vercel.app/api/send-mail', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    console.log('Wiadomość została wysłana');
  } else {
    console.error('Błąd podczas wysyłania wiadomości');
  }
} catch (error) {
  console.error('Wystąpił błąd:', error);
}
```

> **Uwaga:** Wysyłanie danych za pomocą `FormData` jest konieczne, aby poprawnie przesłać plik HTML jako szablon.

---

## **5. Testowanie**

1. Użyj narzędzia Postman, Insomnia lub fetch, aby przetestować wysyłanie wiadomości.
2. Sprawdź skrzynkę odbiorczą nadawcy (lub odbiorcy, jeśli ustawiłeś `Reply-To`).
3. Upewnij się, że:
   - Wiadomość została dostarczona do odpowiedniej skrzynki.
   - Wszelkie szablony lub dane zostały poprawnie załadowane.
   - E-mail nie trafił do spamu (jeśli tak, sprawdź konfigurację DNS).

---

## **6. Rozwiązywanie problemów**

### **Problem: Wiadomości trafiają do spamu**

- Sprawdź poprawność rekordów SPF, DKIM i DMARC w konfiguracji DNS.
- Zweryfikuj, czy treść wiadomości nie zawiera fraz spamerskich.

### **Problem: Sender nie jest poprawnie rozpoznawany**

- Upewnij się, że adres sendera został dodany i zweryfikowany w SendGrid.
- Sprawdź nagłówki wiadomości (szczególnie `From` i `Reply-To`).

---

## **7. Dodawanie nowych zmiennych**

Jeśli formularz ma zawierać nowe zmienne (np. `surname`, `age`), należy podjąć następujące kroki:

1. **Aktualizacja DTO**:
   - Dodaj nowe pole w klasie `SendMailDto` z odpowiednimi walidatorami.
2. **Zmiana w serwisie**:
   - Upewnij się, że nowe zmienne są obsługiwane w metodzie `sendMail` i dodane do szablonu wiadomości.
3. **Aktualizacja szablonu**:
   - Dodaj zmienne w szablonie HTML, zarówno w domyślnym, jak i przesyłanym przez użytkownika.
4. **Aktualizacja dokumentacji**:
   - Uwzględnij nowe pola w instrukcji i przykładach zapytań w tym pliku.

---

Jeśli masz pytania lub problemy, skontaktuj się z administratorem backendu.

