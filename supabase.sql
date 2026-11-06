-- À coller dans Supabase > SQL Editor
create table categories(id serial primary key, name text unique not null, jours_dispo int[] not null default '{}');
create table products(id serial primary key, name text not null, description text default '', price int not null check(price>=0), promo_price int check(promo_price>=0), category_id int references categories(id) on delete set null, jours_dispo int[] not null default '{}', in_stock boolean not null default true, photos text[] not null default '{}', created_at timestamptz default now());
create table push_subscriptions(id serial primary key, endpoint text unique not null, data jsonb not null, created_at timestamptz default now());
alter table categories enable row level security;
alter table products enable row level security;
alter table push_subscriptions enable row level security; -- aucune policy = inaccessible au public
create policy "lecture publique" on categories for select using (true);
create policy "lecture publique" on products for select using (true);
insert into storage.buckets(id,name,public) values('products','products',true) on conflict do nothing;
