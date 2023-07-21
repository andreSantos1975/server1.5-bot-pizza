from typing import Text, List, Any, Dict

from rasa_sdk import Tracker, FormValidationAction, Action
from rasa_sdk.events import EventType
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict


ALLOWED_PIZZA_SIZES = [
    "pequena",
    "media",
    "grande",
    "extra-grande",
    "extra-grande",
    "p",
    "m",
    "g",
    "eg",
]
ALLOWED_PIZZA_TYPES = ["mozzarella", "fungi", "veggie", "pepperoni", "hawaii"]
VEGETARIAN_PIZZAS = ["mozzarella", "fungi", "veggie"]
MEAT_PIZZAS = ["pepperoni", "hawaii"]


class ValidateSimplePizzaForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_simple_pizza_form"

    def validate_pizza_size(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `pizza_size` value."""

        if slot_value.lower() not in ALLOWED_PIZZA_SIZES:
            dispatcher.utter_message(text=f"Aceitamos apenas os tamanhos de pizza: p/m/g/eg.")
            return {"pizza_size": None}
        dispatcher.utter_message(text=f"OK! Você quer uma pizza {slot_value} .")
        return {"pizza_size": slot_value}

    def validate_pizza_type(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `pizza_type` value."""

        if slot_value not in ALLOWED_PIZZA_TYPES:
            dispatcher.utter_message(
                text=f"Não reconheço essa pizza. Nós servimos{'/'.join(ALLOWED_PIZZA_TYPES)}."
            )
            return {"pizza_type": None}
        dispatcher.utter_message(text=f"OK! Você quer uma pizza {slot_value} .")
        return {"pizza_type": slot_value}


class AskForVegetarianAction(Action):
    def name(self) -> Text:
        return "action_ask_vegetarian"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict
    ) -> List[EventType]:
        dispatcher.utter_message(
            text="Gostaria de pedir uma pizza vegetariana?",
            buttons=[
                {"title": "sim", "payload": "/affirm"},
                {"title": "não", "payload": "/deny"},
            ],
        )
        return []


class AskForPizzaTypeAction(Action):
    def name(self) -> Text:
        return "action_ask_pizza_type"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict
    ) -> List[EventType]:
        if tracker.get_slot("vegetarian"):
            dispatcher.utter_message(
                text=f"Que tipo de pizza você quer?",
                buttons=[{"title": p, "payload": p} for p in VEGETARIAN_PIZZAS],
            )
        else:
            dispatcher.utter_message(
                text=f"Que tipo de pizza você quer?",
                buttons=[{"title": p, "payload": p} for p in MEAT_PIZZAS],
            )
        return []


class ValidateFancyPizzaForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_fancy_pizza_form"

    def validate_vegetarian(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `pizza_size` value."""
        if tracker.get_intent_of_latest_message() == "affirm":
            dispatcher.utter_message(
                text="Eu vou lembrar que você prefere vegetariana."
            )
            return {"vegetarian": True}
        if tracker.get_intent_of_latest_message() == "deny":
            dispatcher.utter_message(
                text="Vou lembrar que você não quer uma pizza vegetariana."
            )
            return {"vegetarian": False}
        dispatcher.utter_message(text="eu não entendi.")
        return {"vegetarian": None}

    def validate_pizza_size(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `pizza_size` value."""

        if slot_value not in ALLOWED_PIZZA_SIZES:
            dispatcher.utter_message(text=f"Aceitamos apenas os tamanhos de pizza: p/m/g/eg.")
            return {"pizza_size": None}
        dispatcher.utter_message(text=f"OK! Você quer uma pizza {slot_value} .")
        return {"pizza_size": slot_value}

    def validate_pizza_type(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `pizza_type` value."""

        if slot_value not in ALLOWED_PIZZA_TYPES:
            dispatcher.utter_message(
                text=f"Não reconheço essa pizza. Nós servimos {'/'.join(ALLOWED_PIZZA_TYPES)}."
            )
            return {"pizza_type": None}
        if not slot_value:
            dispatcher.utter_message(
                text=f"Não reconheço essa pizza. Servimos {'/'.join(ALLOWED_PIZZA_TYPES)}."
            )
            return {"pizza_type": None}
        dispatcher.utter_message(text=f"OK! Você quer uma pizza {slot_value} .")
        return {"pizza_type": slot_value}