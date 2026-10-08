---
name: eXir
title: Drinks encyclopedia
roots: [elixir, X]
split: 1
family: encyclopedias
flagship: true
color: '#e9a63f'
started: '2026-08'
sort: '2026-08-07'
dates:
  - 2026-08-19 first commit
  - 2026-08-24 the math engine, the integrity checks and the data pipeline
  - 2026-08-25 the site assembled
  - 2026-09-27 one design shared with its sibling encyclopedias
url: https://kiarashfa.github.io/eXir/
repo: https://github.com/kiarashfa/eXir
line: Drinks where every measure, dilution and strength is computed.
made: for those who find joy in every sip
---

## The idea

Xefy's sibling for the glass: one page per drink, from the Martini to a pour-over coffee, and again no figure typed by hand. The page knows what a bartender knows: how much water the ice will add, how strong the drink is once it has, how many standard drinks it holds, how sweet and how sour it sits, whether it fits its glass. Make one or twelve; serve each to order or batch the lot ahead, with water standing in for the ice it will never meet; switch to ounces and the method follows. Your bar shelf, your plan, your units and your theme stay in your browser.

## The story

eXir was not planned alongside Xefy; it followed naturally. With the whole machinery of an encyclopedia already built and proven, leaving drinks out was impossible to resist, and the engine grew more capable on the way. The same machinery later carried on to Markey and ARMAG.

Like Xefy, it answers my curiosity about what people around the world drink and why, and the simple pleasure of a good glass. I now mix, brew and pour from it.

One struggle came with it. I did not want to promote drinking, yet so many of the drinks are alcoholic; so eXir is honest about alcohol, with a caution on its About page and a closing line on every page asking you to drink responsibly.

The name is Persian: _exir_ (اکسیر), elixir, the draught of healing and immortality, and the best name a drinks encyclopedia could hope for. The capital X is my favourite letter, as in DrXRates and Xefy.

## The challenges

1. **How much the ice adds.** Published figures for dilution contradict each other, because some measure it against the finished drink and some against what was poured. eXir takes one side, the poured volume, says so everywhere, and models the water from Dave Arnold's measurements in Liquid Intelligence, by method and by ice: shaken, stirred, crushed, churned. A sparkling top poured after the shake is kept out of the model; forgetting that once published a Gin Fizz at 8.2% instead of 9.7%.
2. **A batch that is the same drink.** A drink made to order and the same drink batched for twelve must arrive identical. The batch replaces the ice with exactly the water the ice would have given, and the page shows both specs side by side: their equality is the proof that the arithmetic is right.
3. **Strength you can trust.** Pure alcohol is exact from the bottles named, and it is counted in both the US and the UK standard drink; the final strength rests on the dilution model, and is marked as such.
4. **Every kind of drink in its own way.** A cocktail scales by the number of drinks; coffee and tea scale by ratio, where you set the dose or the yield and the other follows while temperature, grind and steeping time stay put; ice is never an ingredient except in blended drinks and punch; and a ferment is charged the sugar its alcohol came from. One engine had to hold all of these rules without letting any of them leak into the others.

## What makes it special

The arithmetic a bartender does by instinct, done for you and shown: dilution, strength, batching and ratios, for every kind of drink, each handled in its own way.

## Built with

Astro · Svelte · TypeScript · Tailwind CSS · MDX · Zod · Pagefind · USDA FoodData Central, producers' figures and Open Food Facts · Wikimedia Commons · Google Analytics · GitHub Pages.
