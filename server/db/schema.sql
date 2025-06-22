-- server/db/schema.sql

-- Drop tables if they exist to allow for clean re-initialization
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;

-- Create Customers table
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    join_date TEXT NOT NULL
);

-- Create Products table
CREATE TABLE Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT
);

-- Create Orders table
CREATE TABLE Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create Order_Items table
CREATE TABLE Order_Items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_each REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Insert Sample Data
INSERT INTO Customers (first_name, last_name, email, join_date) VALUES
('Alice', 'Smith', 'alice@example.com', '2023-01-15'),
('Bob', 'Johnson', 'bob@example.com', '2023-02-20'),
('Charlie', 'Brown', 'charlie@example.com', '2023-03-10'),
('Diana', 'Prince', 'diana@example.com', '2023-04-01');

INSERT INTO Products (name, description, price, category) VALUES
('Laptop', 'Powerful computing device', 1200.00, 'Electronics'),
('Keyboard', 'Mechanical gaming keyboard', 75.00, 'Electronics'),
('Mouse', 'Wireless ergonomic mouse', 30.00, 'Electronics'),
('Monitor', '27-inch 4K display', 350.00, 'Electronics'),
('Desk Chair', 'Ergonomic office chair', 150.00, 'Furniture'),
('Bookshelf', 'Wooden 5-tier bookshelf', 90.00, 'Furniture');

INSERT INTO Orders (customer_id, order_date, total_amount) VALUES
(1, '2023-03-01', 1275.00), -- Alice: Laptop + Keyboard
(2, '2023-03-05', 75.00),   -- Bob: Keyboard
(1, '2023-03-10', 380.00),  -- Alice: Monitor + Mouse
(3, '2023-03-15', 150.00),  -- Charlie: Desk Chair
(4, '2023-04-05', 90.00);   -- Diana: Bookshelf

INSERT INTO Order_Items (order_id, product_id, quantity, price_each) VALUES
(1, 1, 1, 1200.00), -- Laptop
(1, 2, 1, 75.00),   -- Keyboard
(2, 2, 1, 75.00),   -- Keyboard
(3, 4, 1, 350.00),  -- Monitor
(3, 3, 1, 30.00),   -- Mouse
(4, 5, 1, 150.00),  -- Desk Chair
(5, 6, 1, 90.00);   -- Bookshelf