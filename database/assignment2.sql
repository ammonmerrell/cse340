--data for account ironman
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
--change account type to Admin
UPDATE public.account SET account_type = 'Admin' Where account_id = 1;
