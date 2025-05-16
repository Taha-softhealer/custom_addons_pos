# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
{
    "name": "Point Of Sale Happy Hour Sale",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "",
    "description": """""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["views/sh_happy_hours.xml","security/ir.model.access.csv"],
    'assets': {
        'point_of_sale._assets_pos': [],
    },
    "auto_install": False,
    "installable": True,
}