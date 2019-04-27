module QSort where
import Prelude

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





swap :: forall h a. Int -> Int -> STArray h a -> ST h Unit
swap i j arr = do
  -- Read both values
  arrI <- unsafePartial $ ArraySTP.peek i arr
  arrJ <- unsafePartial $ ArraySTP.peek j arr
  -- And try to write the values in the other index
  unsafePartial $ ArraySTP.poke j arrI arr
  unsafePartial $ ArraySTP.poke i arrJ arr


partition :: forall h a. Int -> Int -> (a -> a -> Ordering) -> STArray h a -> ST h Int
partition low high cmp arr =
  do
    -- Select the pivot
    pivot <- unsafePartial $ ArraySTP.peek high arr

    -- Create mutable indexes
    iRef <- Ref.new (low - 1)
    jRef <- Ref.new low

    while
      -- while condition
      do
        j <- Ref.read jRef
        pure $ j <= (high - 1)

      -- while computation
      $ do
          j <- Ref.read jRef
          arrJ <- unsafePartial $ ArraySTP.peek j arr
          comparison <- pure $ cmp arrJ pivot
          -- If current element is smaller than or
          -- equal to pivot
          if (comparison == LT || comparison == EQ)
            then do
              -- increment index of smaller element and swap
              i <- Ref.modify (add 1) iRef
              swap i j arr
            else pure unit

          Ref.modify (add 1) jRef

    -- Finally swap the pivot
    -- And return it's position
    i <- Ref.read iRef
    swap (i + 1) high arr
    pure (i + 1)

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

    sort :: Int -> Int -> ST h Unit
    sort low high =
      if (low >= high)
        then pure unit
        else do
          pivot <- partition low high cmp arr
          sort low (pivot - 1)
          sort (pivot + 1) high
          pure unit

mutableTOQSortBy :: forall a. (a -> a -> Ordering) -> Array a -> Array a
mutableTOQSortBy cmp inmutableArr = run (withArray mutableComputation inmutableArr) where

  mutableComputation :: forall h. STArray h a -> ST h Unit
  mutableComputation arr = sort 0 (length arr - 1) where

    sort :: Int -> Int -> ST h Unit
    sort l h = do
      -- Create mutable indexes
      lowRef  <- Ref.new l
      highRef <- Ref.new h

      while
        -- while condition
        do
          low  <- Ref.read lowRef
          high <- Ref.read highRef
          pure $ low < high

        -- while computation
        $ do
          low  <- Ref.read lowRef
          high <- Ref.read highRef
          iPivot <- partition low high cmp arr

          -- If left part is smaller, then recur for left
          -- part and handle right part iteratively
          if (iPivot - low < high - iPivot)
            then do
              sort low (iPivot - 1)
              _ <- Ref.write (iPivot + 1) lowRef
              pure unit
            -- Else recur for right part
            else do
              sort (iPivot + 1) high
              _ <- Ref.write (iPivot - 1) highRef
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