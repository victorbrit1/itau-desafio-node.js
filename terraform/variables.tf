variable "subscription_id" {
  description = "ID da assinatura Azure"
  type        = string
}

variable "location" {
  description = "Regiao da Azure"
  type        = string
  default     = "brazilsouth"
}

variable "ssh_public_key" {
  description = "Caminho da chave SSH publica"
  type        = string
  sensitive   = true
}

variable "ssh_allowed_cidr" {
  description = "IP autorizado a acessar SSH"
  type        = string
}