"""Who can call and text each child: anyone, the contacts the parent added, or those and limited groups."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory

from .coordinator import FamilyLinkCoordinator
from .entity import ChildEntity, guard_action, platform_setup
from .models import CONTACT_LEVELS

async_setup_entry = platform_setup(lambda c, child: [CallsTextsSelect(c, child)])


class CallsTextsSelect(ChildEntity, SelectEntity):
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator: FamilyLinkCoordinator, child_id: str) -> None:
        super().__init__(coordinator, child_id, "calls_texts")
        self._attr_options = list(CONTACT_LEVELS)

    @property
    def available(self) -> bool:
        return super().available and self.child.contacts in CONTACT_LEVELS.values()

    @property
    def current_option(self) -> str | None:
        return next((name for name, level in CONTACT_LEVELS.items() if level == self.child.contacts), None)

    async def async_select_option(self, option: str) -> None:
        level = CONTACT_LEVELS[option]
        await guard_action(self.coordinator.client.set_contacts_level(self.child_id, level), "calls_texts")
        self.child.contacts = level
        self.coordinator.show_change()
