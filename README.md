# E-Shop

E-Shop to nowoczesna aplikacja e-commerce stworzona w **Next.js** z wykorzystaniem **TypeScript**, **Tailwind CSS** oraz **NextAuth** do uwierzytelniania użytkowników. Aplikacja korzysta z **PostgreSQL** jako bazy danych, a zarządzanie danymi odbywa się za pomocą **Prisma**.

## Funkcjonalności

- **Rejestracja i logowanie użytkowników**: Bezpieczne uwierzytelnianie za pomocą NextAuth.
- **Zarządzanie profilem użytkownika**: Edycja danych osobowych, zmiana avataru.
- **Przeglądanie produktów**: Wyświetlanie produktów z możliwością filtrowania i paginacji.
- **Koszyk zakupowy**: Dodawanie, usuwanie i aktualizacja ilości produktów w koszyku.
- **Składanie zamówień**: Proces realizacji zamówienia z integracją z bazą danych.
- **Historia zamówień**: Przeglądanie historii złożonych zamówień.
- **Responsywny interfejs użytkownika**: Optymalizacja dla urządzeń mobilnych i desktopów.

## Technologie

Projekt wykorzystuje następujące technologie:

- **Next.js**: Framework React do tworzenia aplikacji serwerowo-renderowanych.
- **TypeScript**: Statyczne typowanie dla zwiększenia bezpieczeństwa i czytelności kodu.
- **Tailwind CSS**: Narzędzie do szybkiego stylowania interfejsu użytkownika.
- **NextAuth**: Biblioteka do uwierzytelniania użytkowników.
- **Prisma**: ORM do zarządzania bazą danych PostgreSQL.
- **PostgreSQL**: Relacyjna baza danych.
- **React**: Biblioteka JavaScript do budowania interfejsów użytkownika.
- **DaisyUI**: Biblioteki komponentów UI.


## Instalacja

### Wymagania systemowe

- **Node.js**: Wersja 18 lub nowsza
- **PostgreSQL**: Wersja 12 lub nowsza
- **npm** lub **yarn**: Menedżery pakietów

### Kroki instalacji

1. **Klonowanie repozytorium**

   ```bash
   git clone https://github.com/twoja-nazwa-uzytkownika/e-shop.git
   cd e-shop
   ```

2. **Instalacja zależności**

   ```bash
   npm install
   # lub
   yarn install
   # lub
   pnpm install
   ```

3. **Konfiguracja zmiennych środowiskowych**

   Utwórz plik `.env` w katalogu głównym projektu i dodaj następujące zmienne:

   ```env
   DATABASE_URL=postgresql://uzytkownik:haslo@localhost:5432/e-shop
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=twoj_sekretny_klucz
   AUTH_SECRET=twoj_sekretny_klucz_nextauth
   ```

   - **DATABASE_URL**: Adres połączenia do bazy danych PostgreSQL.
   - **NEXTAUTH_URL**: URL aplikacji Next.js.
   - **NEXTAUTH_SECRET**: Sekretny klucz dla NextAuth.
   - **AUTH_SECRET**: Sekretny klucz dla autoryzacji.

4. **Migracja bazy danych**

   Aby utworzyć tabele w bazie danych, wykonaj migrację przy użyciu Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

   Ta komenda:

   - Tworzy nową migrację z nazwą `init`.
   - Aktualizuje schemat bazy danych w pliku `prisma/schema.prisma`.
   - Generuje klienta Prisma do interakcji z bazą danych.

5. **Uruchomienie aplikacji lokalnie**

   ```bash
   npm run dev
   # lub
   yarn dev
   # lub
   pnpm dev
   ```

   Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Struktura Folderów

├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ └── register/
│ │ ├── orders/
│ │ ├── user/
│ │ │ └── upload-avatar/
│ │ └── ...
│ ├── auth/
│ │ ├── signin/
│ │ └── signup/
│ ├── cart/
│ ├── lib/
│ │ ├── authOptions.ts
│ │ ├── data.ts
│ │ ├── prisma.ts
│ │ └── ...
│ ├── profile/
│ ├── settings/
│ ├── ui/
│ │ ├── avatar/
│ │ ├── footer/
│ │ ├── header/
│ │ ├── product-card/
│ │ └── ...
│ ├── context/
│ │ └── CartContext.tsx
│ ├── page.tsx
│ ├── layout.tsx
│ └── ...
├── prisma/
│ └── schema.prisma
├── public/
│ └── default-avatar.png
├── styles/
│ └── globals.css
├── middleware.ts
├── package.json
├── tsconfig.json
└── README.md

## License

Projekt jest objęty licencją **MIT**. Zobacz plik [LICENSE](LICENSE) aby dowiedzieć się więcej.
