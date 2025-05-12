-- Crée la base de données 'auth_system' si elle n'existe pas
CREATE DATABASE IF NOT EXISTS auth_system;
USE auth_system;

-- Crée la table 'users' si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reset_token_hash VARCHAR(64) DEFAULT NULL, -- Ajout de la colonne pour le hash du token
    reset_token_expires_at DATETIME DEFAULT NULL -- Ajout de la colonne pour l'expiration du token
);

-- Crée la table 'roles' si elle n'existe pas
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crée la table 'user_roles' si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crée la table 'permissions' si elle n'existe pas
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crée la table 'role_permissions' si elle n'existe pas
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crée la table 'sessions' si elle n'existe pas
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crée la table 'components' si elle n'existe pas
CREATE TABLE IF NOT EXISTS components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    characteristics VARCHAR(255), 
    seller_id INT NOT NULL, 
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    FOREIGN KEY (seller_id) REFERENCES users(id) 
);

-- Crée la table 'pcs' si elle n'existe pas
CREATE TABLE IF NOT EXISTS pcs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crée la table 'orders' si elle n'existe pas
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    component_id INT,
    pc_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (component_id) REFERENCES components(id),
    FOREIGN KEY (pc_id) REFERENCES pcs(id)
);

CREATE TABLE IF NOT EXISTS wilayas (
  id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom_fr VARCHAR(100) NOT NULL UNIQUE 
);
CREATE TABLE IF NOT EXISTS commandes (
  id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) DEFAULT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  commune VARCHAR(100) NOT NULL,
  code_postal VARCHAR(10) NOT NULL,
  adresse TEXT NOT NULL,
  informations_supplementaires TEXT DEFAULT NULL,
  total DECIMAL(10,2) NOT NULL,
  date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut_paiement VARCHAR(50) NOT NULL,
  mode_livraison VARCHAR(50) NOT NULL
);

CREATE TABLE commande_details (
  id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  commande_id INT(11) NOT NULL,
  product_id INT(11) NOT NULL,
  quantite INT(11) NOT NULL
);
CREATE TABLE IF NOT EXISTS panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_type ENUM('component', 'pc') NOT NULL COMMENT 'Type de produit (composant ou PC)',
  product_id INT NOT NULL COMMENT 'ID du produit (component_id ou pc_id)',
  quantite INT NOT NULL DEFAULT 1,
  date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  CHECK (quantite > 0),
  UNIQUE KEY unique_cart_item (user_id, product_type, product_id) COMMENT 'Empêche les doublons pour un même produit'
);




