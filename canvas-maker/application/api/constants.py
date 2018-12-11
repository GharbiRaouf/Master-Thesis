# good examples
import nanoid


class CanvasInitializer:
    businessModelCanvasOptimizedPowerSale = {
        "canvas_description": "Default Business Model ",
        "canvas_id": nanoid.generate(size=25),
        "canvas_type":"standard_canvas",
        "canvas_lastUpdate": 0,
        "canvas_name": "Default Optimized Power Sale",
        "canvas_team": ["Canvas Maker"],
        "canvas_notes": [
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "IT Companies",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "key-partners",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "Energy Producers",
                "note_id": nanoid.generate(size=25),
                "note_info_expanded": False,
                "note_lastEdited": 0,
                "note_position": "key-partners",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "Analyzes and\nevaluations\nvalue propositions\nCost savings,\nDates to read\nfall away, increased\nCost and\nconsumption transparency",
                "note_headline": "Process optimization",
                "note_id": nanoid.generate(size=25),
                "note_info_expanded": False,
                "note_lastEdited": 0,
                "note_position": "key-activites",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "Automatic Service",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "customer-relationships",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "Cost and consumption transparency\n\n",
                "note_headline": "Cost savings",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "value-propositions",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "Prosumers, households, businesses",
                "note_headline": "Pantograph",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "customer-segments",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "if the data analysis is taken over by a service provider for more accurate electricity forecasting",
                "note_headline": "ElVUs",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "customer-segments",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "App",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "channels",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "Our Company  Facebook Page",
                "note_headline": "Social Media - Facebook",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "channels",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "Dates",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "key-resources",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "Analysis Tools ",
                "note_id": nanoid.generate(size=25),
                "note_lastEdited": 0,
                "note_position": "key-resources",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_id": nanoid.generate(size=25),
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "High investment costs for IT systems",
                "note_lastEdited": 0,
                "note_position": "cost-structure",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_id": nanoid.generate(size=25),
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "",
                "note_headline": "Personnel costs (analysts)",
                "note_lastEdited": 0,
                "note_position": "cost-structure",
                "note_questionNumber": "",
                "note_status": "new"
            },
            {
                "note_id": nanoid.generate(size=25),
                "note_author": "Canvas Maker Team",
                "note_color": "#ffeb3b",
                "note_description": "Larger profit margins through process optimization",
                "note_headline": "Proceeds per kilowatt-hour sold",
                "note_lastEdited": 0,
                "note_position": "revenue-streams",
                "note_questionNumber": "",
                "note_status": "new"
            }
        ]
    }

    DEFAULT_CANVAS = (
        businessModelCanvasOptimizedPowerSale,
    )

    def get_default_canvas(self, user_id):
        for item in self.DEFAULT_CANVAS:
            item["canvas_team"] = [{"user": user_id, "role": "creator"}]
        return self.DEFAULT_CANVAS
