module QSort where
import Prelude (class Ord, Ordering(..), Unit, add, bind, compare, discard, otherwise, pure, show, unit, ($), (+), (-), (<), (<$>), (<*>), (<=), (<>), (==), (>), (||))

import Control.Monad.ST (run, ST, for, while)
import Control.Monad.ST.Ref (modify)
import Control.Monad.ST.Ref as Ref
import Data.Array.ST (STArray, withArray)
import Data.Array.ST.Partial as ArraySTP
import Data.Array (filter, uncons)
import Data.Maybe (Maybe(..))
import Data.Ordering (invert)
import Partial.Unsafe (unsafePartial)

qsort :: Array Int -> Array Int
qsort xs = case uncons xs of
  Nothing -> []
  Just { head, tail } ->
    let
      small = filter (\x -> x < head)  tail
      mid   = filter (\x -> x == head) tail
      large = filter (\x -> x > head)  tail
    in
      qsort small <> mid <> [head] <> qsort large

qsort' :: forall a. Ord a => Array a -> Array a
qsort' = qsortBy compare

qsortBy :: forall a. (a -> a -> Ordering) -> Array a -> Array a
qsortBy cmp xs = case uncons xs of
  Nothing -> []
  Just { head, tail } ->
    let
      small = filter (\x -> (cmp x head) == LT) tail
      mid   = filter (\x -> (cmp x head) == EQ) tail
      large = filter (\x -> (cmp x head) == GT) tail
    in
      qsortBy cmp small <> mid <> [head] <> qsortBy cmp large




foreign import length :: forall h a. STArray h a -> Int
-- withArray :: forall h a b. (STArray h a -> ST h b) -> Array a -> ST h (Array a)

-- mutableQSortBy cmpNumberAsc [3, 2, 4, 9, 7, 3]
-- mutableQSortBy cmp arr = sort 0 $ length arr - 1 $
-- withArray :: forall h a b. (STArray h a -> ST h b) -> Array a -> ST h (Array a)
-- peek :: forall h a. Int -> STArray h a -> ST h (Maybe a)
-- WARNING ST.run with $ causes an error
-- https://github.com/purescript/documentation/blob/master/errors/EscapedSkolem.md

mutableQSortBy :: forall a. (a -> a -> Ordering) -> Array a -> Array a
mutableQSortBy cmp inmutableArr = run (withArray mutableComputation inmutableArr) where

  mutableComputation :: forall h. STArray h a -> ST h Unit
  mutableComputation arr = sort 0 (length arr - 1) where
    swap :: Int -> Int -> ST h Unit
    swap i j = do
      -- Read both values
      arrI <- unsafePartial $ ArraySTP.peek i arr
      arrJ <- unsafePartial $ ArraySTP.peek j arr
      -- And try to write the values in the other index
      unsafePartial $ ArraySTP.poke j arrI arr
      unsafePartial $ ArraySTP.poke i arrJ arr

    cmpM :: Int -> Int -> ST h Ordering
    cmpM i j = do
      -- Read both values
      arrI <- unsafePartial $ ArraySTP.peek i arr
      arrJ <- unsafePartial $ ArraySTP.peek j arr
      pure $ cmp arrI arrJ

    dec :: Int -> Int
    dec n = n - 1

    inc :: Int -> Int
    inc n = n + 1

    sort :: Int -> Int -> ST h Unit
    sort maxLeft minRight =
      if (minRight - maxLeft <= 1)
        then pure unit
        else do
          -- Create mutable indexes
          iPivot  <- Ref.new maxLeft
          iLeft  <- Ref.new maxLeft
          iRight <- Ref.new minRight

          while
            -- while condition
            do
              left <- Ref.read iLeft
              right <- Ref.read iRight

              pure $ right > left

            -- while computation
            $ do
                left <- Ref.read iLeft
                right <- Ref.read iRight
                pivot <- Ref.read iPivot

                if (pivot == left)
                  then do
                    comparison <- cmpM pivot right
                    if (comparison == LT || comparison == EQ)
                      then Ref.modify dec iRight
                      else do
                        swap pivot right
                        Ref.write right iPivot
                  else do
                    comparison <- cmpM pivot left
                    if (comparison == GT || comparison == EQ)
                      then Ref.modify inc iLeft
                      else do
                        swap pivot left
                        Ref.write left iPivot

          pivot <- Ref.read iPivot
          sort maxLeft (pivot - 1)
          sort (pivot + 1) minRight

          pure unit

mutable1 :: Int
mutable1 = run do
    -- ref :: STRef r Int
    ref <- Ref.new 0
    -- val :: Int
    val <- Ref.read ref
    -- ST r Int
    Ref.write (val + 2) ref


mutable2 :: String
mutable2 = run do
    ref <- Ref.new ""
    for 0 5 (\i -> Ref.write (show i) ref)
    Ref.read ref



mutable' :: Int
mutable' = run do
  -- left and right :: STRef r Int
  left  <- Ref.new 0
  right <- Ref.new 6

  while
    -- condition
    do
      l <- Ref.read left
      r <- Ref.read right
      pure $ r > l

    -- computation
    $ modify (add 1) left

  Ref.read left

mutable'' :: Int
mutable'' = run do
  -- left and right :: STRef r Int
  left  <- Ref.new 0
  right <- Ref.new 6

  while
    -- condition
    ((>) <$> Ref.read right <*> Ref.read left)

    -- computation
    $ modify (add 1) left

  Ref.read left


cmpNumberAsc :: Int -> Int -> Ordering
cmpNumberAsc a b | a < b     = LT
                 | a == b    = EQ
                 | otherwise = GT

cmpNumberDesc :: Int -> Int -> Ordering
cmpNumberDesc a b = invert $ cmpNumberAsc a b