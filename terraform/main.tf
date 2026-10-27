terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# 1. Resource Group
resource "azurerm_resource_group" "itau" {
  name     = "rg-itau-demo"
  location = var.location

  tags = {
    projeto = "itau"
    ambiente = "demonstracao"
  }
}

# 2. Rede virtual
resource "azurerm_virtual_network" "itau" {
  name                = "vnet-itau"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.itau.location
  resource_group_name = azurerm_resource_group.itau.name
}

# 3. Sub-rede
resource "azurerm_subnet" "itau" {
  name                 = "subnet-itau"
  resource_group_name  = azurerm_resource_group.itau.name
  virtual_network_name = azurerm_virtual_network.itau.name
  address_prefixes     = ["10.0.1.0/24"]
}

# 4. IP publico
resource "azurerm_public_ip" "itau" {
  name                = "ip-itau"
  location            = azurerm_resource_group.itau.location
  resource_group_name = azurerm_resource_group.itau.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# 5. Regras de seguranca
resource "azurerm_network_security_group" "itau" {
  name                = "nsg-itau"
  location            = azurerm_resource_group.itau.location
  resource_group_name = azurerm_resource_group.itau.name

  security_rule {
    name                       = "SSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.ssh_allowed_cidr
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTP"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# 6. Interface de rede
resource "azurerm_network_interface" "itau" {
  name                = "nic-itau"
  location            = azurerm_resource_group.itau.location
  resource_group_name = azurerm_resource_group.itau.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.itau.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.itau.id
  }
}

# 7. Associar regras de seguranca
resource "azurerm_network_interface_security_group_association" "itau" {
  network_interface_id      = azurerm_network_interface.itau.id
  network_security_group_id = azurerm_network_security_group.itau.id
}

# 8. Maquina virtual
resource "azurerm_linux_virtual_machine" "itau" {
  name                = "vm-itau-demo"
  resource_group_name = azurerm_resource_group.itau.name
  location            = azurerm_resource_group.itau.location

  size           = "Standard_F1als_v7"
  admin_username = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.itau.id
  ]

  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = var.ssh_public_key
  }

  os_disk {
    name                 = "disk-itau"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    disk_size_gb         = 30
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  custom_data = base64encode(
    file("${path.module}/cloud-init.yaml")
  )

  tags = {
    projeto  = "itau"
    ambiente = "demonstracao"
  }
}