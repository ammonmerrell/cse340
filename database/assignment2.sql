--data for account ironman
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
--change account type to Admin
UPDATE public.account SET account_type = 'Admin' Where account_id = 1;
--delete date from database
DELETE FROM public.account Where account_id =1;
--Edit gm hummer 
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');
--sport data join
SELECT inventory.inv_make, inventory.inv_model
FROM public.inventory INNER JOIN public.classification ON classification.classification_id = inventory.classification_id
AND classification_name = 'Sport'