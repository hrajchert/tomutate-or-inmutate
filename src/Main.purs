module Main where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import QSort (cmpNumberAsc, mutableQSortBy, qsortBy, mutableTOQSortBy)
import Data.Array (sortBy)

main :: Effect Unit
main = do
  log $ show $ mutableQSortBy cmpNumberAsc [1, 2, 3]
  log $ show $ qsortBy cmpNumberAsc [1, 2, 3]
  log $ show $ mutableTOQSortBy cmpNumberAsc [1, 2, 3]
  log $ show $ sortBy cmpNumberAsc [1, 2, 3]

