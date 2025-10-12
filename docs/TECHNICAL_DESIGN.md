# 🏗️ Frituur Ordering System - Technical Design

> How I'm building this system step by step

## 🎯 What This Document Is

This is my technical blueprint - it shows exactly how I'm building the frituur ordering system. Think of it as the architectural plans for a house, but for software.

**Tech Stack**: Flutter + NestJS + PostgreSQL + WebSockets + Stripe  
**Architecture**: Modular Monolith (organized but not overcomplicated)  
**Timeline**: 6 weeks (solo development)

---

## 🏠 System Architecture

```mermaid
graph TB
    subgraph "Users"
        CA[Customer<br/>Phone/Computer]
        AA[Admin<br/>Computer]
    end
    
    subgraph "My Application"
        API[NestJS Server<br/>The Brain of Everything]
        
        subgraph "Modules"
            CAT[Catalog<br/>Menu & Items]
            ORD[Ordering<br/>Cart & Orders]
            PRC[Pricing<br/>Calculate Costs]
            PAY[Payments<br/>Handle Money]
            KIT[Kitchen<br/>Order Queue]
            I18N[Languages<br/>Dutch & English]
        end
    end
    
    subgraph "Data Storage"
        DB[(PostgreSQL<br/>Database)]
    end
    
    subgraph "External Services"
        STRIPE[Stripe<br/>Payment Company]
    end
    
    CA --> API
    AA --> API
    API --> DB
    API --> STRIPE
```

**What's Happening Here?**

- **Users** interact with the app (customers order, admins manage)
- **My Application** processes everything (the NestJS server)
- **Modules** are doing there own jobs (catalog, ordering, pricing, etc.)
- **Database** stores all the information
- **Stripe** handles payments securely

## 🏠 Core Modules

The system is organized into several core modules, each responsible for a specific part of the application's functionality. Think of each module as a dedicated room in a house, focused on its own job.

```mermaid
graph LR
    subgraph "My System House"
        A[Catalog<br/>Menu & Items]
        B[Ordering<br/>Cart & Orders]
        C[Pricing<br/>Calculate Costs]
        D[Payments<br/>Handle Money]
        E[Kitchen<br/>Order Queue]
        F[Languages<br/>Dutch & English]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    F --> A
    F --> B
    F --> C
    F --> D
    F --> E
```

### Catalog Module

**What it does**: Manages all the food items

- Menu items (fries, burgers, drinks)
- Categories (appetizers, mains, desserts)
- Allergen information (gluten, nuts, etc.)
- Stock availability (what's available today)

### Ordering Module

**What it does**: Handles the ordering process

- Shopping cart (add/remove items)
- Order creation (turn cart into order)
- Order tracking (where is my food?)

### Pricing Module

**What it does**: Figures out costs and timing

- Price calculations (base price + extras)
- Ready time estimation (when will it be ready?)
- Discount logic (special offers)

### Payments Module

**What it does**: Handles all payment stuff

- Stripe integration (secure payments)
- Payment processing (charge the card)
- Transaction history (payment records)

### Kitchen Module

**What it does**: Helps kitchen staff work efficiently

- Order queue (what needs to be made)
- Status updates (in progress, ready, etc.)
- Workflow optimization (make it efficient)

### i18n Module

**What it does**: Makes everything multilingual

- Dutch language support
- English language support
- Language switching (change language anytime)

---

## 🗄️ Database Design

Think of the database like a well-organized filing cabinet where I store all the information about the frituur system.

### Database Structure

```mermaid
erDiagram
    CATEGORIES ||--o{ MENU_ITEMS : contains
    CATEGORIES ||--o{ CATEGORY_TRANSLATIONS : "has translations"
    MENU_ITEMS ||--o{ MENU_ITEM_TRANSLATIONS : "has translations"
    ORDERS ||--o{ ORDER_ITEMS : has
    MENU_ITEMS ||--o{ ORDER_ITEMS : "ordered as"
    ORDERS ||--o| PAYMENTS : "paid with"
    
    CATEGORIES {
        uuid id PK
        int display_order "Show order"
        timestamp created_at
    }
    
    CATEGORY_TRANSLATIONS {
        uuid id PK
        uuid category_id FK
        string language_code "en, nl, fr, etc."
        string name "Translated name"
        text description "Translated description"
        timestamp created_at
    }
    
    MENU_ITEMS {
        uuid id PK
        uuid category_id FK
        decimal base_price "Price in euros"
        int preparation_time_minutes "How long to make"
        array allergens "Gluten, nuts, etc."
        boolean is_available "In stock?"
        timestamp created_at
    }
    
    MENU_ITEM_TRANSLATIONS {
        uuid id PK
        uuid menu_item_id FK
        string language_code "en, nl, fr, etc."
        string name "Translated name"
        text description "Translated description"
        timestamp created_at
    }
    
    ORDERS {
        uuid id PK
        string customer_name "Who ordered"
        string customer_email "Contact info"
        decimal total_amount "Total cost"
        string status "pending, in_progress, ready"
        timestamp estimated_ready_time "When ready"
        timestamp created_at
        timestamp updated_at
    }
    
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK "Which order"
        uuid menu_item_id FK "What item"
        int quantity "How many"
        decimal unit_price "Price per item"
        decimal total_price "Total for this item"
    }
    
    PAYMENTS {
        uuid id PK
        uuid order_id FK "Which order"
        string stripe_payment_intent_id "Stripe reference"
        decimal amount "Amount paid"
        string currency "EUR"
        string status "succeeded, failed, pending"
        timestamp created_at
    }
```

### What Each Table Stores

| Table | Purpose | Example Data |
|-------|---------|--------------|
| **Categories** | Food categories (language-agnostic) | Category structure and ordering |
| **Category Translations** | Category names in different languages | "Appetizers" (EN), "Voorgerechten" (NL) |
| **Menu Items** | Individual food items (language-agnostic) | Price, prep time, allergens, availability |
| **Menu Item Translations** | Item names/descriptions in different languages | "Large Fries" (EN), "Grote Frietjes" (NL) |
| **Orders** | Customer orders | "Order #123 for John Doe" |
| **Order Items** | Items in each order | "2x Large Fries, 1x Cheeseburger" |
| **Payments** | Payment information | "Payment for Order #123 - €15.50" |

### Multilingual Support (Normalized Approach)

Instead of separate columns for each language, I use separate translation tables:

- **Categories** → **Category Translations** (one row per language)
- **Menu Items** → **Menu Item Translations** (one row per language)

**Benefits:**

- ✅ **Easy to add languages** - Just insert new translation rows
- ✅ **No schema changes** - Adding French, German, etc. requires no database changes
- ✅ **Better performance** - Only load translations you need
- ✅ **Cleaner queries** - Join when you need translations

**Example Query:**

```sql
-- Get menu items in Dutch
SELECT m.*, t.name, t.description 
FROM menu_items m
JOIN menu_item_translations t ON m.id = t.menu_item_id
WHERE t.language_code = 'nl';
```

### How Tables Connect

```mermaid
graph LR
    A[Categories] --> B[Menu Items]
    B --> C[Order Items]
    C --> D[Orders]
    D --> E[Payments]
    
    A --> A1[Category Translations]
    B --> B1[Menu Item Translations]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style A1 fill:#f0f4c3
    style B1 fill:#f0f4c3
```

**The Flow**:

1. **Categories** contain **Menu Items** (Appetizers → Fries)
2. **Menu Items** become **Order Items** when added to cart
3. **Order Items** belong to **Orders** (customer's order)
4. **Orders** have **Payments** (how they paid)
5. **Categories** and **Menu Items** have **Translations** (multilingual support)

---

## 🔌 API Design

This section explains how the API connects the frontend and backend. It covers both the main REST endpoints and the real-time WebSocket events.

### REST Endpoints (Regular Requests)

```mermaid
graph LR
    subgraph "Frontend (Customer App)"
        A[Get Menu]
        B[Create Order]
        C[Pay Order]
        D[Track Order]
    end
    
    subgraph "Backend (API Server)"
        E[Menu API]
        F[Order API]
        G[Payment API]
        H[Kitchen API]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
```

| What I Need | API Endpoint | What It Does |
|-------------|--------------|--------------|
| **Get Menu** | `GET /api/menu/categories` | Show all food categories |
| **Get Items** | `GET /api/menu/items?category=appetizers` | Show items in a category |
| **Create Order** | `POST /api/orders` | Create a new order |
| **Track Order** | `GET /api/orders/123` | Check order status |
| **Pay Order** | `POST /api/payments/create-intent` | Start payment process |
| **Kitchen View** | `GET /api/kitchen/orders` | Show orders to kitchen staff |

### WebSocket Events (Real-time Updates)

WebSockets for real-time communication!

```mermaid
sequenceDiagram
    participant C as Customer
    participant S as Server
    participant K as Kitchen
    
    C->>S: Join order room
    Note over C,S: Customer wants to track their order
    
    K->>S: Update order status
    Note over K,S: Kitchen marks order as "in progress"
    
    S->>C: Order status updated!
    Note over S,C: Customer sees update instantly
```

**What Happens in Real-time:**

- **Order Status Changes**: "pending" → "in progress" → "ready"
- **Stock Updates**: When items run out or come back
- **Time Updates**: When estimated ready time changes
- **Notifications**: Important updates for customers

### The Complete Flow

```mermaid
graph TD
    A[Customer opens app] --> B[Load menu from API]
    B --> C[Add items to cart]
    C --> D[Create order via API]
    D --> E[Process payment via API]
    E --> F[Kitchen sees order]
    F --> G[Real-time status updates]
    G --> H[Order ready notification]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
    style H fill:#e8f5e8
```

---

## 📱 Flutter App Structure (Frontend)

The Flutter app is structured to keep things modular, clean, and scalable. Each folder has a clear purpose to make developing and maintaining features faster and easier.

```mermaid
graph TD
    A[Flutter App] --> B[main.dart<br/>App Entry Point]
    A --> C[app/<br/>App Configuration]
    A --> D[features/<br/>Main App Features]
    A --> E[shared/<br/>Reusable Components]
    A --> F[l10n/<br/>Languages]
    
    C --> C1[app.dart<br/>App Setup]
    C --> C2[routes.dart<br/>Navigation]
    
    D --> D1[menu/<br/>Browse Food]
    D --> D2[cart/<br/>Shopping Cart]
    D --> D3[orders/<br/>Order Management]
    D --> D4[payments/<br/>Payment Flow]
    D --> D5[admin/<br/>Admin Panel]
    
    E --> E1[widgets/<br/>UI Components]
    E --> E2[models/<br/>Data Models]
    E --> E3[services/<br/>API Calls]
    
    F --> F1[app_en.arb<br/>English Text]
    F --> F2[app_nl.arb<br/>Dutch Text]
```

### What Each Folder Does

| Folder | Purpose | Example |
|--------|---------|---------|
| **app/** | App setup and navigation | How the app starts and moves between screens |
| **features/** | Main app functionality | Menu browsing, cart, orders, payments |
| **shared/** | Reusable components | Buttons, forms, API services |
| **l10n/** | Language files | "Betaal" vs "Pay" (Dutch/English) |

---

## 🖥️ NestJS Backend Structure (Backend)

The backend uses the NestJS framework for a modular, maintainable codebase. Each business domain is separated into its own module, making development and scaling easier.

```mermaid
graph TD
    A[NestJS Server] --> B[main.ts<br/>Server Entry Point]
    A --> C[app.module.ts<br/>Main App Module]
    A --> D[modules/<br/>Business Departments]
    A --> E[shared/<br/>Common Tools]
    A --> F[config/<br/>Configuration]
    
    D --> D1[catalog/<br/>Menu Management]
    D --> D2[ordering/<br/>Order Processing]
    D --> D3[pricing/<br/>Price Calculation]
    D --> D4[payments/<br/>Payment Handling]
    D --> D5[kitchen/<br/>Kitchen Workflow]
    D --> D6[i18n/<br/>Language Support]
    
    E --> E1[database/<br/>Database Connection]
    E --> E2[websocket/<br/>Real-time Updates]
    E --> E3[utils/<br/>Helper Functions]
    
    F --> F1[database.config.ts<br/>Database Settings]
    F --> F2[app.config.ts<br/>App Settings]
```

### What Each Module Does

| Module | Department Job | Who Uses It |
|--------|----------------|-------------|
| **catalog** | Manages menu items and categories | Customers browsing, admins editing |
| **ordering** | Handles shopping cart and orders | Customers placing orders |
| **pricing** | Calculates costs and timing | System automatically |
| **payments** | Processes payments with Stripe | Customers paying |
| **kitchen** | Manages order queue and status | Kitchen staff |
| **i18n** | Handles Dutch/English switching | All users |

---

## 🔒 Security

Security is a top priority in any software project to ensure that user data and business information remain safe. This system includes multiple layers of safeguards to protect against threats and unauthorized access.

### What I'm Protecting Against

```mermaid
graph TD
    A[Security Measures] --> B[Input Validation<br/>Check data before using]
    A --> C[Rate Limiting<br/>Prevent spam attacks]
    A --> D[Secure Payments<br/>Stripe handles card data]
    A --> E[HTTPS Only<br/>Encrypted communication]
    
    B --> B1[Email format validation]
    B --> B2[Required field checks]
    B --> B3[Data type validation]
    
    C --> C1[Max 10 requests per minute]
    C --> C2[Block suspicious activity]
    
    D --> D1[No card data stored locally]
    D --> D2[Stripe handles everything]
```

### Testing

Testing is essential to ensure the reliability and quality of the frituur ordering system.

```mermaid
graph LR
    A[Testing Strategy] --> B[Unit Tests<br/>Test individual functions]
    A --> C[Integration Tests<br/>Test how parts work together]
    A --> D[End-to-End Tests<br/>Test complete user flows]
    
    B --> B1[Backend: Test pricing calculations]
    B --> B2[Frontend: Test UI components]
    
    C --> C1[Test API endpoints]
    C --> C2[Test database operations]
    
    D --> D1[Test complete ordering flow]
    D --> D2[Test payment process]
```

**Testing Goals:**

- **80%+ code coverage** - Most of the code is tested
- **All critical paths tested** - Important features work
- **Automated testing** - Tests run automatically

---

## 🚀 Deployment

Deploying the frituur ordering system brings the project from development into real-world use. This step ensures all components are connected, secure, and running smoothly on their production environment.

### Docker Setup (Easy Deployment)

```mermaid
graph TB
    subgraph "Docker Containers"
        A[Backend Container<br/>NestJS Server]
        B[Frontend Container<br/>Flutter Web App]
        C[Database Container<br/>PostgreSQL]
    end
    
    D[User] --> B
    B --> A
    A --> C
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
```

**Why Docker?**

- **Consistent environment** - Works the same everywhere
- **Easy deployment** - One command to start everything
- **Easy development** - Same setup for everyone

### Performance Goals

| Goal | Target | Why It Matters |
|------|--------|----------------|
| **Page Load** | <2 seconds | Users won't wait longer |
| **API Response** | <500ms | Feels instant |
| **Real-time Updates** | <100ms | Live updates feel smooth |
| **Concurrent Users** | 100+ | Can handle busy times |

---

## 🔮 Future Enhancements (What I Could Add Later)

### Phase 2 (After MVP)

- **Performance boost** - Redis caching, faster responses
- **Email notifications** - "Your order is ready!"
- **Analytics dashboard** - See what's popular

### Phase 3 (Advanced Features)

- **Multi-restaurant support** - Multiple frituur locations
- **Advanced reporting** - Detailed business insights
- **Inventory management** - Track ingredients
- **Delivery tracking** - GPS tracking for delivery
- **Loyalty program** - Rewards for regular customers

---

## 🎯 Summary

This technical design shows how I'm building a professional, scalable frituur ordering system using modern technologies. The modular architecture makes it easy to understand, test, and maintain, while the comprehensive feature set provides real value to both customers and restaurant staff.

**Key Strengths:**

- 🏗️ **Clean architecture** - Easy to understand and modify
- 🌍 **Multilingual support** - Perfect for Belgium
- ⚡ **Real-time updates** - Modern user experience
- 🔒 **Secure payments** - Industry-standard security
- 📱 **Cross-platform** - Works on web and mobile
- 🧪 **Well-tested** - Reliable and maintainable

**Ready to build something awesome! 🚀**