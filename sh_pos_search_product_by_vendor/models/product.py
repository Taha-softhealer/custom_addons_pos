from odoo import api, fields, models

class ProductProduct(models.Model):
    _inherit = 'product.product'

    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["seller_ids"]
        return result
    
    
    
class ProductSupplierInfo(models.Model):
    _inherit = 'product.supplierinfo'
    
    @api.model
    def _load_pos_data_domain(self, data):
        return []

    @api.model
    def _load_pos_data_fields(self, config_id):
        return []

    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data["pos.config"]["data"][0]["id"])
        return {
            "data": (
                self.search_read(domain, fields, load=False)
                if domain is not False
                else []
            ),
            "fields": fields,
        }
        

class ProductTemplate(models.Model):
    _inherit = 'product.template'
    
    @api.model
    def _load_pos_data_domain(self, data):
        return []

    @api.model
    def _load_pos_data_fields(self, config_id):
        return ["id","name"]

    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data["pos.config"]["data"][0]["id"])
        return {
            "data": (
                self.search_read(domain, fields, load=False)
                if domain is not False
                else []
            ),
            "fields": fields,
        }
        
class PosSession(models.Model):
    _inherit = "pos.session"

    @api.model
    def _load_pos_data_models(self, config_id):
        record = super()._load_pos_data_models(config_id)
        record += [
            "product.supplierinfo",
            "product.template"
        ]
        return record