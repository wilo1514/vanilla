@'
# Skill: Decision Trees

Use deterministic decision trees for buyer classification, lead scoring, email template selection, and next action.

## Segment Classification

If company keywords include:
- extract, extraction, vanilla extract -> extract_house
- flavor, flavors, fragrance, aroma -> flavor_house
- distributor, wholesale, specialty foods, ingredients distributor -> specialty_distributor
- manufacturer, food production, ice cream, beverage, bakery manufacturing -> premium_food_manufacturer
- chocolate, chocolatier, cacao -> chocolatier
- pastry, bakery, patisserie -> pastry_chef or bakery
- hotel, resort, hospitality, fine dining -> luxury_hospitality
- private label, co-pack, retail brand -> private_label
- gourmet market, specialty retail -> gourmet_retail
Else -> unknown

## Title Classification

If title includes:
- procurement, purchasing, sourcing, buyer -> commercial_buyer
- R&D, product development, innovation, formulation -> technical_buyer
- chef, pastry, chocolatier, culinary -> culinary_buyer
- founder, owner, CEO, president -> decision_maker
- sales, marketing -> indirect_contact
Else -> unknown_contact

## Lead Score

segment_score:
extract_house = 35
flavor_house = 35
specialty_distributor = 32
premium_food_manufacturer = 30
chocolatier = 24
pastry_chef = 22
bakery = 18
luxury_hospitality = 18
private_label = 25
gourmet_retail = 20
unknown = 5

title_score:
commercial_buyer = 30
technical_buyer = 28
culinary_buyer = 22
decision_maker = 20
indirect_contact = 8
unknown_contact = 5

location_score:
NY = 10
NJ = 10
IL = 10
CA = 8
FL = 8
TX = 8
WA = 6
OR = 6
other_US = 5
non_US = 2

email_score:
personal_business_email = 10
generic_company_email = 4
free_email = 1
missing_email = 0

fit_score:
premium_keywords = 10
organic_keywords = 8
specialty_keywords = 8
vanilla_keywords = 8
unknown_fit = 0

Priority:
A = score >= 80
B = score >= 60 and score < 80
C = score >= 40 and score < 60
HOLD = score < 40

## Next Action

If priority A and email_status valid:
Create draft sequence_1 and status pending_approval.

If priority B:
Create softer intro draft and status pending_approval.

If priority C:
Add to nurture list, do not send first campaign.

If HOLD:
Needs manual review.

If unsubscribed, bounced, or do_not_contact:
Never contact.
'@ | Set-Content -Encoding UTF8 .\skills\03_decision_trees.md